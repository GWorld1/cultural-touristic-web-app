// app/login/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie'; // Import js-cookie

export default function InstagramLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Email and password are required.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // IMPORTANT: REPLACE WITH YOUR ACTUAL BACKEND LOGIN URL
        {
          email,
          password,
        }
      );

      setMessage(response.data.message || "Login successful!");
      console.log("Login successful:", response.data);

      // --- Store the token in a cookie instead of localStorage ---
      // For simplicity, we'll store the JWT string in a client-readable cookie.
      // Set an expiry (e.g., 1 day) for the cookie. Adjust as needed.
      Cookies.set('jwtToken', response.data.token, { expires: 1, secure: process.env.NODE_ENV === 'production' }); // 'secure' flag for HTTPS in production
      
      // Keep user and sessionId in localStorage for client-side access if needed,
      // as they are not security-sensitive in the same way the JWT itself is.
      // If your backend sets sessionId as an HttpOnly cookie, you wouldn't store it here.
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("sessionId", response.data.sessionId);
      }

      router.push("/dashboard");

      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        const axiosError = err;

        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Bad Request: Missing login data."
              );
              break;
            case 401:
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Authentication Failed: Invalid credentials or email not verified."
              );
              break;
            case 500:
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Server Error: Failed to login. Please try again later."
              );
              break;
            default:
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  `An unexpected error occurred (Status: ${axiosError.response.status}).`
              );
          }
        } else if (axiosError.request) {
          setError(
            "Network Error: No response from server. Please check your internet connection."
          );
        } else {
          setError(
            "Client-side Error: Unable to send login request. Please try again."
          );
        }
      } else if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError("An unknown error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-4">
      {/* Left side - Photo collage (unchanged) */}
      <div className="hidden md:block md:w-1/2 max-w-md relative">
        <div className="relative w-full h-[500px]">
          <div className="absolute top-0 left-0 z-10 transform -rotate-6">
            <div className="relative w-48 h-80 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/road.jpg?height=320&width=192"
                alt="Instagram post"
                width={192}
                height={320}
                className="object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full w-32 h-10"></div>
              <div className="absolute bottom-4 right-4 text-red-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute top-10 left-20 z-20">
            <div className="relative w-56 h-96 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/download.jpg?height=384&width=224"
                alt="Instagram post"
                width={192}
                height={320}
                className="object-cover"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full w-36 h-10"></div>
              <div className="absolute bottom-4 right-4 text-red-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 z-0 transform rotate-6">
            <div className="relative w-48 h-80 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/OIP.jpg?height=320&width=192"
                alt="Instagram post"
                width={192}
                height={320}
                className="object-cover"
              />
            </div>
          </div>

          {/* Emoji bubbles */}
          <div className="absolute top-0 left-24 z-30 bg-white rounded-full px-4 py-2 shadow-md">
            <div className="flex items-center space-x-1">
              <span className="text-lg">🟣</span>
              <span className="text-lg">👀</span>
              <span className="text-lg">🧡</span>
            </div>
          </div>

          <div className="absolute top-40 right-10 z-30 bg-green-400 rounded-md px-3 py-1 shadow-md">
            <div className="flex items-center space-x-1 text-white">
              <span>✓</span>
            </div>
          </div>

          <div className="absolute bottom-20 right-0 z-30 bg-white rounded-full p-2 shadow-md border-2 border-yellow-400">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-green-300"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 max-w-md flex flex-col items-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-5xl">360&deg; Site Tour</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
            {message && (
              <p className="text-green-500 text-sm text-center mt-2">
                {message}
              </p>
            )}

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-green-500 via-red-500 to-yellow-500 text-white py-1.5 rounded-lg font-medium text-sm ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 font-medium">OR</div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-700">Don&apos;t have an account?</span>{" "}
            <Link href="/signup" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}