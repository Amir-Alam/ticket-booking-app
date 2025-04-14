"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // Sanitize input by stripping HTML tags and trimming whitespace
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/<[^>]*>?/gm, "")
      .replace(/[!$%^()#?+=:;~`&*|{}<>]/g, "")
      .trim();
  };

  // Proper handleChange using sanitization
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "email" ? sanitizeInput(value) : value,
    });
  };

  const router = useRouter();
  const handeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { email, password } = formData;

    // Simple validation to check required fields
    if (!email || !password) {
      setError("Please fill the required fields!");
      return;
    }

    console.log("Login data:", formData);

    const NEXT_PUBLIC_BACKEND_APP_URL = process.env.NEXT_PUBLIC_BACKEND_APP_URL;
    // TODO: Secure API call will be placed here
    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_BACKEND_APP_URL}/api/login`,
        { email, password }
      );

      if (response.status === 200) {
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Login Successfully.");
        router.push("/booking");
      }
    } catch (error: any) {
      console.error("Axios Error:", error);
      setError(
        error.response.data.message || "User Login Failed. Please Try Again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 via-blue-200 to-sky-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          🔐 Sign In to Your Account
        </h2>
        <form className="space-y-6" onSubmit={handeSubmit}>
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 py-3 border border-gray-300 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <a href="#" className="text-blue-500 right-8 hover:underline">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-medium border border-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
