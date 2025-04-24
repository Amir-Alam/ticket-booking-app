"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_APP_URL = process.env.NEXT_PUBLIC_BACKEND_APP_URL;

const TicketBooking: React.FC = () => {
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [recentlyBooked, setRecentlyBooked] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<number | null>(null);
  const [userType, setUserType] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setUserId(user.id);
      setUserType(user.userType);
      setUsername(user.name);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const totalSeats = 80;
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(
        `${NEXT_PUBLIC_BACKEND_APP_URL}/api/fetch-booked-seats`
      );
      const booked = resp.data
        .filter((s: any) => s.booked_by !== null)
        .map((s: any) => s.seat_number);
      setBookedSeats(booked);
    } catch {
      console.error("Failed to load seats");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSeats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleBook = async () => {
    const n = parseInt(inputValue);
    if (isNaN(n) || n <= 0) {
      setError("Please enter a valid number of seats.");
      return;
    }
    if (n > 7) {
      setError("You can book a maximum of 7 seats.");
      return;
    }
    setError("");
    try {
      const resp = await axios.post(
        `${NEXT_PUBLIC_BACKEND_APP_URL}/api/book-seats`,
        {
          userId,
          seatCount: n,
          userType,
        }
      );
      const newly = resp.data.seats as number[];
      setBookedSeats((prev) => [...prev, ...newly]);
      setRecentlyBooked(newly);
      setInputValue("");
    } catch (e: any) {
      console.error("Booking error", e);
      setError(
        e.response?.data?.error || "An error occurred while booking seats."
      );
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`${NEXT_PUBLIC_BACKEND_APP_URL}/api/reset-bookings`, {
        user_type: userType,
      });
      setBookedSeats([]);
      setRecentlyBooked([]);
      setError("");
      await fetchSeats();
    } catch (e: any) {
      console.error("Reset error", e);
      setError(
        e.response?.data?.error || "An error occurred while resetting bookings."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username} onLogout={handleLogout} />

      <div className="flex-grow flex justify-center items-center bg-gray-200 px-2 md:px-0">
        <div
          className="
            flex flex-col 
            md:flex-row md:space-x-10 md:p-10
            space-y-6 p-6
            bg-white rounded shadow-lg
            w-full md:w-auto
          "
        >
          {/* ——— Seats Section ——— */}
          <div className="w-full md:w-auto">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">
              Ticket Booking
            </h1>

            {loading ? (
              <div className="text-center text-black">Loading seats...</div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                {seats.map((seat) => {
                  const isBooked = bookedSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      disabled={isBooked}
                      className={`
                        w-10 h-10 rounded text-white font-semibold
                        ${
                          isBooked
                            ? "bg-red-500 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }
                      `}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <span className="bg-yellow-300 px-3 py-1 rounded text-black">
                Booked Seats = {bookedSeats.length}
              </span>
              <span className="bg-green-300 px-3 py-1 rounded text-black">
                Available Seats = {totalSeats - bookedSeats.length}
              </span>
            </div>

            {recentlyBooked.length > 0 && (
              <div className="mt-4 text-center">
                <span className="text-black font-medium">Recently Booked:</span>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {recentlyBooked.map((s) => (
                    <span
                      key={s}
                      className="bg-yellow-300 px-3 py-1 rounded text-black"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ——— Form Section ——— */}
          <div className="w-full md:w-auto flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2 text-black">Book Seats</h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter number of seats"
              className="border p-2 rounded mb-2 w-full md:w-48 text-black text-sm md:text-base"
            />
            {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
            <button
              onClick={handleBook}
              className="bg-blue-500 text-white p-2 rounded w-full md:w-48 mb-2 hover:bg-blue-600 text-sm md:text-base"
            >
              Book
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 text-white p-2 rounded w-full md:w-48 hover:bg-red-600 text-sm md:text-base"
            >
              Reset Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBooking;
