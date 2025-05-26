'use client'
import { useState } from "react";
import Link from "next/link"; // Assuming you are using Next.js for the Link component
import React from "react"; // Import React to use React.FormEvent

// Define your API base URL
// Make sure this matches where your Node.js backend is running
const API_BASE_URL = "http://localhost:5000/api/auth"; // <--- IMPORTANT: Verify this URL

export default function InstagramSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // Added phone state
  const [message, setMessage] = useState(""); // For success/error messages
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  // Type the event parameter 'e' as React.FormEvent<HTMLFormElement>
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent default form submission behavior

    // Clear previous messages
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    // Basic client-side validation
    if (!email || !password || !name) {
      setMessage("Email, password, and username are required.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
        // Clear form fields on successful registration
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
        setMessage(""); // Clear message after success
      } else {
        setMessage(data.error || "Registration failed.");
        setMessageType("error");
      }
    } catch (e) {
      // You might also want to type this 'e' if it's a caught error.
      // For a network error, it's often a generic Error object.
      // e.g., catch (e: Error) { ... }
      console.error("Registration error:", e);
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false); // Always stop loading, regardless of success or failure
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300">
        <div className="text-center mb-6">
          <h1 className="font-serif text-5xl">360&deg; Site Tour</h1>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-500 font-medium text-sm">
            Interested in touristic attractions with great dynamic viewing, sign
            up.
          </p>
        </div>

        <form className="space-y-2" onSubmit={handleSignup}>
          {" "}
          {/* Added onSubmit to the form */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Added required attribute
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Added required attribute
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Full Name" // Changed placeholder to "Full Name"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required // Added required attribute
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone (optional)" // Added phone input
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="submit" // Changed to type="submit" to trigger form's onSubmit
            className="w-full bg-gradient-to-r from-green-500 via-red-500 to-yellow-500 text-white py-1.5 rounded font-medium"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
          {/* Display messages */}
          {message && (
            <p
              className={`text-center text-sm ${
                messageType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-700">Already have an account?</span>{""}
            <Link href="/login" className="text-blue-500 font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
