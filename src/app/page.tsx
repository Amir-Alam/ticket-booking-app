"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the Feature type
type Feature = {
  title: string;
  desc: string;
};

const features: Feature[] = [
  {
    title: "Instant Booking",
    desc: "Book your workspace instantly with a few clicks.",
  },
  {
    title: "Smart Dashboard",
    desc: "Get personalized insights and manage bookings efficiently.",
  },
  {
    title: "Seat Preferences",
    desc: "Choose your ideal seat with our interactive map.",
  },
  {
    title: "Secure Access",
    desc: "Experience safe and encrypted login processes.",
  },
];

const HomePage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen bg-cover bg-center bg-[url('/office.jpg')] flex flex-col justify-center items-center px-6 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 z-0" />
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold mb-4 z-10"
        >
          Transform Your Workspace
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="text-xl max-w-xl mb-8 z-10"
        >
          Smart, seamless, and stylish seat booking for modern teams.
        </motion.p>
        <div className="flex space-x-4 z-10">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition font-medium"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition font-medium"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-16 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-8xl">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
              <Sparkles className="w-5 h-5" /> {feature.title}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Floor Plan Section */}
      <section className="w-full bg-white py-24 px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Live Floor Plan
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-5 gap-4 justify-center">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 rounded-lg cursor-pointer transition-all duration-300 shadow ${
                i % 5 === 0
                  ? "bg-red-400"
                  : i % 7 === 0
                  ? "bg-gray-400"
                  : "bg-green-400"
              }`}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-sm"></div> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded-sm"></div> Booked
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-sm"></div> Selected
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full bg-gradient-to-br from-white to-blue-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <img
            src="co-workspace.webp"
            alt="workspace"
            className="w-full h-auto"
          />
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>24/7 real-time seat availability</li>
              <li>Instant booking with zero hassle</li>
              <li>Secure cloud-based infrastructure</li>
              <li>Analytics dashboard for admins</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-blue-700 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-pulse" />
        <h3 className="text-4xl font-bold mb-4">
          Start Revolutionizing Your Office Today
        </h3>
        <p className="mb-8 text-lg max-w-xl mx-auto">
          Modernize your seat booking experience and empower your workspace.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            onClick={() =>
              router.push("https://github.com/Amir-Alam/ticket-booking-app")
            }
          >
            Get Started
          </button>
          <button
            className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-700 font-semibold transition"
            onClick={() =>
              router.push("https://www.linkedin.com/in/amir--alam/")
            }
          >
            Contact Sales
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
