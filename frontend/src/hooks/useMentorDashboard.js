// src/hooks/useMentorDashboard.js

//A custom React hook that handles all the data fetching and navigation logic for the mentor dashboard. 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const useMentorDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);         // basic info: name, email, roles
  const [profile, setProfile] = useState(null);   // mentor profile: skills, bio etc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1) No token → send to login
    if (!token) {
      navigate("/login");
      return;
    }

    const authHeader = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        setLoading(true);

        // 2) Fetch basic user info
        const userRes = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: authHeader,
        });
        const userData = userRes.data;

        // 3) Role guard — if not a mentor, kick out
        if (!userData.roles?.includes("mentor")) {
          navigate("/dashboard/mentee");
          return;
        }

        setUser(userData);

        // 4) Fetch mentor profile
        const profileRes = await axios.get(`${BASE_URL}/api/mentor-profile/me`, {
          headers: authHeader,
        });

        setProfile(profileRes.data);

        // 5) If profile not complete → redirect to onboarding
        if (!profileRes.data?.isProfileComplete) {
          navigate("/onboarding/mentor");
          return;
        }

      } catch (err) {
        // Profile not found (404) = new mentor, send to onboarding
        if (err?.response?.status === 404) {
          navigate("/onboarding/mentor");
          return;
        }

        // Token expired or invalid
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return { user, profile, loading, error };
};

export default useMentorDashboard;