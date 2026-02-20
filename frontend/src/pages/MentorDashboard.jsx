// src/pages/MentorDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        setError("Failed to load user. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 1500);
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-semibold">Mentor Dashboard</h1>
        <p className="text-sm text-gray-500">Logged in as:</p>

        {/* ✅ Proof — shows this specific user's data from DB */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Roles:</span> {user.roles?.join(", ")}</p>
          <p><span className="font-medium">User ID:</span> {user._id}</p>
          <p><span className="font-medium">Email Verified:</span> {user.isEmailVerified ? "Yes" : "No"}</p>
          <p><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full border rounded-lg py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MentorDashboard;