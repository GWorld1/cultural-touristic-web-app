// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const [profileData, setProfileData] = useState<any>(null); // Use a more specific type if you know the profile data structure
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // <-- ADDED THIS LINE
  const router = useRouter();

  useEffect(() => {
    const authenticateAndFetchProfile = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("jwtToken");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setError("No authentication token found. Please log in.");
        router.push("/login");
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch Protected Data from Backend
        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            // REPLACE WITH YOUR ACTUAL BACKEND URL
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfileData(response.data);
        setMessage("Profile data loaded successfully!"); // Use setMessage here
      } catch (err: unknown) {
        console.error("Failed to fetch profile:", err);
        setMessage(""); // Clear any previous success message on error

        if (axios.isAxiosError(err)) {
          const axiosError = err;
          if (axiosError.response) {
            if (
              axiosError.response.status === 401 ||
              axiosError.response.status === 403
            ) {
              setError("Session expired or unauthorized. Please log in again.");
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("user");
              localStorage.removeItem("sessionId");
              router.push("/login");
            } else {
              setError(
                (axiosError.response.data as { error?: string })?.error ||
                  "Failed to load profile data."
              );
            }
          } else if (axiosError.request) {
            setError(
              "Network Error: Could not connect to the profile service."
            );
          } else {
            setError("Client-side error fetching profile.");
          }
        } else if (err instanceof Error) {
          setError(`An unexpected error occurred: ${err.message}`);
        } else {
          setError("An unknown error occurred while fetching profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetchProfile();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");
    }
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading user data and profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>User data not found. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
      }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}
      >
        Dashboard
      </h1>
      {message && (
        <p className="text-green-500 text-sm text-center mb-2">{message}</p>
      )}{" "}
      {/* Display success message */}
      <p style={{ fontSize: "1.1em", marginBottom: "15px" }}>
        Welcome,{" "}
        <strong style={{ color: "#007bff" }}>{user.name || user.email}</strong>!
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: "15px" }}>
        Your role:{" "}
        <strong style={{ color: "#28a745", textTransform: "capitalize" }}>
          {user.role}
        </strong>
      </p>
      <p style={{ fontSize: "0.9em", color: "#777" }}>
        User ID: <code>{user.id}</code>
      </p>
      {profileData && (
        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #eee",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            Additional Profile Information:
          </h3>
          <p>
            Some specific data from protected route:{" "}
            {profileData.someProtectedField}
          </p>
          {/* Render more profile data here */}
        </div>
      )}
      <button
        onClick={handleLogout}
        style={{
          display: "block",
          width: "150px",
          margin: "30px auto 0",
          padding: "10px 15px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1em",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        Logout
      </button>
    </div>
  );
}
