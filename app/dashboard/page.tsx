// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const authenticateAndFetchProfile = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // --- Get the token from cookie ---
      const token = Cookies.get('jwtToken');
      // Keep user and sessionId from localStorage if you stored them there
      const storedUser = localStorage.getItem('user');
      const storedSessionId = localStorage.getItem('sessionId');


      if (!token || !storedUser) {
        setError('No authentication token found. Please log in.');
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch Protected Data from Backend
        const response = await axios.get('http://localhost:5000/api/auth/me', { // REPLACE WITH YOUR ACTUAL BACKEND URL
          headers: {
            Authorization: `Bearer ${token}`, // Still send the JWT token in the Authorization header
          },
          // If your backend sets the cookie as HttpOnly and you are making cross-origin requests,
          // you might need withCredentials: true on your Axios config, but for Authorization: Bearer,
          // it's usually not necessary as the token is manually added to headers.
          // withCredentials: true,
        });

        setProfileData(response.data);
        setMessage('Profile data loaded successfully!');

      } catch (err: unknown) {
        console.error('Failed to fetch profile:', err);
        setMessage('');

        if (axios.isAxiosError(err)) {
          const axiosError = err;
          if (axiosError.response) {
            if (axiosError.response.status === 401 || axiosError.response.status === 403) {
              setError('Session expired or unauthorized. Please log in again.');
              // Clear local storage and cookie on unauthorized/expired
              handleLogout(); // Use the logout function to clear everything
            } else {
              setError((axiosError.response.data as { error?: string })?.error || 'Failed to load profile data.');
            }
          } else if (axiosError.request) {
            setError('Network Error: Could not connect to the profile service.');
          } else {
            setError('Client-side error fetching profile.');
          }
        } else if (err instanceof Error) {
          setError(`An unexpected error occurred: ${err.message}`);
        } else {
          setError('An unknown error occurred while fetching profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetchProfile();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('jwtToken'); // Remove the JWT token cookie
      localStorage.removeItem('user'); // Remove user data from localStorage
      localStorage.removeItem('sessionId'); // Remove sessionId from localStorage
    }
    router.push('/login'); // Redirect to login after logout
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Loading user data and profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>User data not found. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Dashboard</h1>
      {message && <p className="text-green-500 text-sm text-center mb-2">{message}</p>}
      <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>
        Welcome, <strong style={{ color: '#007bff' }}>{user.name || user.email}</strong>!
      </p>
      <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>
        Your role: <strong style={{ color: '#28a745', textTransform: 'capitalize' }}>{user.role}</strong>
      </p>
      <p style={{ fontSize: '0.9em', color: '#777' }}>
        User ID: <code>{user.id}</code>
      </p>

      {profileData && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Additional Profile Information:</h3>
          <p>Some specific data from protected route: {profileData.someProtectedField}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          display: 'block',
          width: '150px',
          margin: '30px auto 0',
          padding: '10px 15px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          transition: 'background-color 0.3s ease-in-out',
        }}
      >
        Logout
      </button>
    </div>
  );
}