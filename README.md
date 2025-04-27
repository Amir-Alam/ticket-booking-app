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

---

## 🛠️ Database Setup (PostgreSQL)

Follow the steps below to create the necessary tables and populate the initial data in your PostgreSQL database:

### 📋 Create Tables

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type SMALLINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create seats table
CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  seat_number INTEGER UNIQUE NOT NULL, -- 1 to 80
  row_number INTEGER NOT NULL,         -- 1 to 12
  booked_by INTEGER REFERENCES users(id),
  booked_at TIMESTAMP
);
```

### 📦 Populate `seats` Table

Run the following SQL block once to auto-generate 80 seats, each mapped to a row:

```sql
-- Run this once to populate the 80 seats
DO $$
DECLARE
  i INTEGER := 1;
BEGIN
  WHILE i <= 80 LOOP
    INSERT INTO seats (seat_number, row_number)
    VALUES (i, CASE
                WHEN i <= 77 THEN CEIL(i / 7.0)::INTEGER
                ELSE 12
              END);
    i := i + 1;
  END LOOP;
END$$;
```

> 💡 Seats 1 to 77 are evenly distributed across rows 1 to 11 (7 seats per row), and the last 3 seats go into row 12.

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
- Form validation happens both on server and client.
- Add rate limiting or JWT auth for production setup.

---

## 📤 Future Improvements

- ✅ Add seat UI layout with real-time booking
- 🧾 JWT-based session management
- 📊 Admin dashboard to view bookings
- 📬 Email confirmation or OTP login

---

---

## 🚀 Deployment Guide (Production)

Follow these steps to **deploy the Smart Seat Booking System** on a real server (AWS EC2 with Nginx, Node.js)!

---

### 🛠️ 1. Set Up Your EC2 Instance

- Login to AWS Console → EC2 → Launch a new instance.
- Choose an OS: **Ubuntu Server 22.04 LTS** (or your preferred version).
- Select an instance type (e.g., `t2.micro` for free tier).
- Create a new key pair or use existing (download `.pem` file safely!).
- Open ports:
  - Allow HTTP (port 80), HTTPS (port 443), and SSH (port 22) in your **Security Group**.

---

### ⚙️ 2. Install Required Software

SSH into your instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

Then install:

```bash
# Update your server
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install git -y

# Install Nginx (for reverse proxy)
sudo apt install nginx -y
```

✅ **Now your server is ready!**

---

### 📥 3. Clone Your Project

Move to a desired directory (like `/var/www`):

```bash
cd /var/www
sudo git clone https://github.com/Amir-Alam/ticket-booking-app.git.git
cd seat-booking-app
```

Install dependencies:

```bash
npm install
```

Create your `.env` file with your production database details.

---

### 🛠️ 4. Build and Start the App

```bash
npm run build
npm run start
```

👉 This will **build** your Next.js app for production and **start** it on default port `3000`.

---

### 🌐 5. Configure Nginx as Reverse Proxy

Open the Nginx config file:

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the contents with:

```nginx
server {
    listen 80;
    server_name your-domain.com; # or your public IP if no domain

    location / {
        proxy_pass http://localhost:3000; # Forward requests to Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit.

**Restart Nginx** to apply changes:

```bash
sudo systemctl restart nginx
```

✅ Now, **when users hit your public IP or domain**, Nginx will **catch** the request and **forward** it to your running Node.js app!

---

### 🎯 6. Keep Your App Alive Forever (PM2)

Install **PM2** to run your app as a background service:

```bash
sudo npm install pm2 -g
pm2 start npm --name "seat-booking-app" -- start
pm2 save
pm2 startup
```

This ensures your app **auto-starts even after server reboot!** 🔥

---

### 🔒 7. (Optional) Set Up SSL with Let's Encrypt

Want HTTPS (SSL) for FREE? 🛡️ Use Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx
```

Follow the prompts to automatically install an SSL certificate for your domain.

---

## 📌 Behind the Scenes: What Happens When a User Visits?

- **DNS** resolves your domain to your **EC2 Public IP**.
- **Nginx** receives the request on port 80 (HTTP).
- Nginx **reverse proxies** the request to **localhost:3000** where your Node.js (Next.js) app is running.
- **Your App** processes the request and sends back the response (HTML, CSS, JS).
- Browser renders your beautiful seat booking website! 🪑✨

---

## 🎉 Final Result

App is now **LIVE**, **Production-ready**, and **accessible** worldwide! 🌎🚀🎉👏

---

# 🏁 Quick Deployment Commands Cheat Sheet

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update and Install
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Clone Project
cd /var/www
sudo git clone https://github.com/Amir-Alam/ticket-booking-app.git
cd seat-booking-app
npm install
npm run build
npm run start

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
sudo systemctl restart nginx

# Install PM2
sudo npm install -g pm2
pm2 start npm --name "seat-booking-app" -- start
pm2 save
pm2 startup
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 🧑‍💻 Author

Made with ❤️ by [Amir Alam](https://github.com/Amir-Alam)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
