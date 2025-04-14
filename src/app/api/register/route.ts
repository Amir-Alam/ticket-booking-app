import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

type requestPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/* ------------------------ API FOR USER REGISTRATION ------------------------

 API URL : /api/register

 METHOD : POST

 PAYLOAD : {
              "name": "YourName"
              "email": "abc@gmail.com",
              "password": "securePassword",
              "confirmPassword": "securePassword"
            } 

*/

export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as requestPayload;
  try {
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Rquired prameters are missing." },
        { status: 400 }
      );
    }

    const nameRegex = /[!@#-$%^&*()_+=<>?,./:;""{}[\]|\\]/;

    if (nameRegex.test(name)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Name, Please Try Again.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password and Confirm Password are not same.",
        },
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

    // First checking if Email already exist or not
    const checkEmail = `SELECT email FROM users WHERE email = $1 LIMIT 1`;
    const searchEmail = await db.query(checkEmail, [email]);

    if (searchEmail.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    //Hashing the password befe storing in the database.
    const saltRound = 12;
    const hashedPassword = bcrypt.hashSync(password, saltRound);

    const query = `INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4)`;

    const insertValues = [name, email, hashedPassword, "2"];

    const insertQuery = await db.query(query, insertValues);
    return NextResponse.json(
      {
        success: true,
        message: "User Registered successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went Wrong.", error },
      { status: 500 }
    );
  }
}
