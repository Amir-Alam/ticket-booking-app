import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type ReqsuestPayload = {
  user_type: number;
};

/* ------------------------ API TO RESET BOOKINGS ------------------------

 API URL : /api/reset-bookings

 METHOD : POST

 PAYLOAD : {
              "user_type": "1"
            } 

*/

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ReqsuestPayload;
  try {
    const { user_type } = body;
    if (user_type !== 1) {
      return NextResponse.json(
        { message: "Invalid User, Not Allowed To Reset Bookings." },
        { status: 400 }
      );
    }
    const client = await db.connect();

    await client.query(`UPDATE seats SET booked_by = NULL, booked_at = NULL`);

    return NextResponse.json({
      success: true,
      message: "Seats Reset Successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something Went Wrong.", error: error },
      { status: 500 }
    );
  }
}
