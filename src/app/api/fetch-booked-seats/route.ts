import { NextResponse } from "next/server";
import db from "@/lib/db";

/* ------------------- API TO FETCH ALL SEATS (BOOKED & UNBOOKED) -------------------

 API URL : /api/fetch-booked-seats

 METHOD : GET

 PAYLOAD : NO PAYLOAD REQUIRED

*/

export async function GET() {
  try {
    const result = await db.query(
      `SELECT seat_number, row_number, booked_by FROM seats ORDER BY seat_number`
    );
    return NextResponse.json({
      success: true,
      message: "Booked Seats Fetched Successfully.",
      result: result.rows,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something Went Wrong.",
      error: error,
    });
  }
}
