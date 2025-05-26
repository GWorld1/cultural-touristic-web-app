// app/login/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection
import axios, { AxiosError } from "axios"; // Import axios and AxiosError type

export default function InstagramLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [message, setMessage] = useState(""); // State for success messages (less common for login, but good to have)
  const [loading, setLoading] = useState(false); // State for loading indicator
  const router = useRouter(); // Initialize the router

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent default form submission behavior

    // Clear previous messages
    setError("");
    setMessage("");
    setLoading(true); // Set loading to true

    try {
      // Basic client-side input validation
      if (!email || !password) {
        setError("Email and password are required.");
        setLoading(false);
        return;
      }

      // Make API call to your backend's login endpoint
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // IMPORTANT: REPLACE WITH YOUR ACTUAL BACKEND LOGIN URL
        {
          email,
          password,
        }
      );

      // If the request is successful (Axios handles 2xx status codes by default)
      setMessage(response.data.message || "Login successful!");
      console.log("Login successful:", response.data);

      // Store the token and user info in localStorage
      // Ensure localStorage is available (only in browser environment)
      if (typeof window !== "undefined") {
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("sessionId", response.data.sessionId);
      }

      // Redirect to a protected dashboard or home page
      router.push("/dashboard"); // Redirect to your dashboard page

      // Clear the form (optional, could also redirect immediately)
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      // Explicitly type as unknown
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        // Type guard for Axios errors
        const axiosError = err; // err is now inferred as AxiosError due to the type guard

        if (axiosError.response) {
          // Server responded with a status code outside 2xx
          switch (axiosError.response.status) {
            case 400: // From your backend: if (!email || !password)
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Bad Request: Missing login data."
              );
              break;
            case 401: // From your backend: 'Email not verified' or 'Invalid credentials'
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Authentication Failed: Invalid credentials or email not verified."
              );
              break;
            case 500: // From your backend: general server error
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Server Error: Failed to login. Please try again later."
              );
              break;
            default:
              // Any other unexpected status from the server
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  `An unexpected error occurred (Status: ${axiosError.response.status}).`
              );
          }
        } else if (axiosError.request) {
          // The request was made but no response was received (e.g., network error, server unreachable)
          setError(
            "Network Error: No response from server. Please check your internet connection."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(
            "Client-side Error: Unable to send login request. Please try again."
          );
        }
      } else if (err instanceof Error) {
        // Handle generic JavaScript Errors
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        // Fallback for truly unknown error types
        setError("An unknown error occurred during login.");
      }
    } finally {
      setLoading(false); // Always set loading to false after the request
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
