import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type requestPayload = {
  userId: string;
  seatCount: string;
  userType: string;
};

/* ------------------------ API TO BOOK SEATS ------------------------

 API URL : /api/book-seats

 METHOD : POST

 PAYLOAD : {
              "userId": "1",
              "seatCount": "5",
              "userType": "0"
            } 

*/

export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as requestPayload;
  try {
    const { userId, seatCount, userType } = body;
    if (!userId || !seatCount || !userType) {
      return NextResponse.json({
        success: false,
        message: "Required Parameters Are Missing.",
      });
    }

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1. Check if there are any available seats
      const availableSeatsResult = await client.query(
        `
          SELECT COUNT(*) AS available_seats
          FROM seats
          WHERE booked_by IS NULL;
        `
      );

      const availableSeats = parseInt(
        availableSeatsResult.rows[0].available_seats,
        10
      );

      // If no seats are available, return a message that all seats are booked
      if (availableSeats === 0) {
        return NextResponse.json(
          { success: false, message: "All seats are fully booked." },
          { status: 409 }
        );
      }

      // 2. Find a row with enough free seats
      const rowResult = await client.query(
        `
          SELECT row_number, array_agg(seat_number) AS available_seats
          FROM seats
          WHERE booked_by IS NULL
          GROUP BY row_number
          HAVING COUNT(*) >= $1
          ORDER BY row_number
          LIMIT 1;
        `,
        [seatCount]
      );

      let seatsToBook: number[] = [];

      if (rowResult.rows.length > 0) {
        seatsToBook = rowResult.rows[0].available_seats.slice(0, seatCount);
      } else {
        // 3. No full row available, pick nearest seats overall
        const nearbyResult = await client.query(
          `
            SELECT seat_number
            FROM seats
            WHERE booked_by IS NULL
            ORDER BY seat_number
            LIMIT $1;
          `,
          [seatCount]
        );

        seatsToBook = nearbyResult.rows.map((r) => r.seat_number);
      }

      // 4. Book those seats
      const now = new Date();
      for (const seat of seatsToBook) {
        await client.query(
          `
            UPDATE seats
            SET booked_by = $1, booked_at = $2
            WHERE seat_number = $3 AND booked_by IS NULL;
          `,
          [userId, now, seat]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json(
        {
          message: "Booking successful",
          seats: seatsToBook,
        },
        { status: 200 }
      );
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Booking failed:", err);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Something Went Wrong",
      error: error,
    });
  }
}
