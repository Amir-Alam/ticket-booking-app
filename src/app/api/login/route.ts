import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

type requestPayload = {
  email: string;
  password: string;
};

/* ------------------------ API FOR USER LOGIN ------------------------

 API URL : /api/login

 METHOD : POST

 PAYLOAD : {
              "email": "abc@gmail.com",
              "password": "securePassword"
            } 

*/

export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as requestPayload;
  try {
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Rquired prameters are missing." },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Email, Please Try Again.",
        },
        { status: 400 }
      );
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }

    // Query the database to find the user by email
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Please check your credentials.",
        },
        { status: 400 }
      );
    }

    // search email and then use bcrypt to compare the stored hashed password in the users table
    const user = result.rows[0]; // Assuming the user object is in the first row

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password. Please try again.",
        },
        { status: 400 }
      );
    }

    // If credentials are correct, return success message and any other info
    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.user_type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong.",
        },
        { status: 500 }
      );
    }
  }
}
