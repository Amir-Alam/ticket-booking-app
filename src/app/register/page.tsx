"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  // Sanitization: remove HTML tags, special characters, trim
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/<[^>]*>?/gm, "")
      .replace(/[!$%^()#?+=:;~`&*|{}<>]/g, "")
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // Sanitize name and email
    const sanitizedValue =
      name === "name" || name === "email" ? sanitizeInput(value) : value;

    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { name, email, password, confirmPassword } = formData;

    // Basic validation
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include: • 1 uppercase letter\n• 1 lowercase letter\n• 1 number\n• 1 special character (@$!%*?&)"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const NEXT_PUBLIC_BACKEND_APP_URL = process.env.NEXT_PUBLIC_BACKEND_APP_URL;

    console.log("NEXT_BACKEND_APP_URL is : ", NEXT_PUBLIC_BACKEND_APP_URL);
    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_BACKEND_APP_URL}/api/register`,
        { name, email, password, confirmPassword }
      );

      console.log("response is : =============", response.data);
      if (response.status === 201) {
        alert("Registered Successfully.");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Axios Error:", error);
      if (error.response?.data) {
        setError(
          error.response.data.message ||
            "User Registration Failed. Please Try Again."
        );
      } else {
        setError("Something Went Wrong. Please Try Again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Create an Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400"
            />
          </div>

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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400"
            />
            <button
              type="button"
              onClick={toggleConfirm}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-medium border border-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
