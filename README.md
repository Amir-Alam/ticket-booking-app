# 🎟️ Smart Seat Booking System

A full-stack seat booking application built with **Next.js (App Router)**, **TypeScript**, and **PostgreSQL**. Users can register, login, and book available seats in an intelligent, optimized way with seamless API integration.

---

## 🚀 Features

- 👤 User Registration & Login (with input validation and password hashing)
- 🎯 Book Nearest or Row-wise Available Seats
- 🪑 View All Booked & Unbooked Seats
- 💡 Intelligent logic to find best seats either row-wise or nearest to each other
- 🔒 Secure password handling with `bcryptjs`
- 🧪 Input validation for email, password, and name
- 💾 PostgreSQL integration for persistent data storage

---

## 🧰 Tech Stack

| Tech       | Description                             |
| ---------- | --------------------------------------- |
| Next.js    | Full-stack React framework (App Router) |
| TypeScript | Type-safe backend and frontend          |
| PostgreSQL | Relational database                     |
| bcryptjs   | Password hashing for security           |

---

## 📦 API Endpoints

### 1. 👤 Register User

```
POST /api/register
```

**Payload:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secure@123",
  "confirmPassword": "Secure@123"
}
```

**Validation Rules:**

- Name cannot contain special characters
- Email must be valid
- Password must be ≥ 8 characters, include uppercase, digit & special character

---

### 2. 🔐 Login User

```
POST /api/login
```

**Payload:**

```json
{
  "email": "john@example.com",
  "password": "Secure@123"
}
```

Returns user details on successful login.

---

### 3. 🪑 Book Seats

```
POST /api/book-seats
```

**Payload:**

```json
{
  "userId": "1",
  "seatCount": "5",
  "userType": "0"
}
```

**Logic:**

- First tries to find an entire row with required seats
- If not found, books closest available seats
- Auto records `booked_by` and `booked_at` timestamps

**Responses:**

- ✅ Success: Seats booked and returned
- ⚠️ Conflict: All seats already booked
- ❌ Validation errors

---

### 4. 📥 Fetch All Seats (Booked + Available)

```
GET /api/fetch-booked-seats
```

**Returns:**

```json
[
  {
    "seat_number": 1,
    "row_number": "A",
    "booked_by": null
  },
  {
    "seat_number": 2,
    "row_number": "A",
    "booked_by": "3"
  }
]
```

---

## 🗃️ Database Schema Overview

**Table: `users`**
| Field | Type |
|------------|---------|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR |
| email | VARCHAR UNIQUE |
| password | TEXT |
| user_type | INT |

**Table: `seats`**
| Field | Type |
|------------|---------|
| seat_number | SERIAL |
| row_number | TEXT |
| booked_by | INT (FK → users.id) |
| booked_at | TIMESTAMP |

---

## 🛠️ Setup & Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/seat-booking-app.git
cd seat-booking-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Database

Create a `.env` file with your PostgreSQL credentials:

```env
DB_HOST='YOUR_DB_HOST'
DB_USER='YOUR_DB_USERNAME'
DB_PASSWORD='YOUR_DB_PASSWORD'
DB_NAME='YOUR_DB_NAME'
DB_PORT=YOUR_DB_PORT
```

### 4. Run the development server

```bash
npm run dev
```

App will be running at: [http://localhost:3000](http://localhost:3000)

---

## 📌 Notes

- All seat booking actions are transactional for consistency.
- `bcryptjs` used with 12 salt rounds for secure password storage.
- Form validation happens both on server and client (if frontend is connected).
- Add rate limiting or JWT auth for production setup.

---

## 📤 Future Improvements

- ✅ Add seat UI layout with real-time booking
- 🧾 JWT-based session management
- 📊 Admin dashboard to view bookings
- 📬 Email confirmation or OTP login

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 🧑‍💻 Author

Made with ❤️ by [Your Name](https://github.com/your-username)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
