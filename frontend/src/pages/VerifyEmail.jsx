// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const sendOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!email.trim()) {
      setMsg({ type: "error", text: "Please enter your email first." });
      return;
    }

    try {
      setSending(true);
      await axios.post(`${BASE_URL}/api/verification/send`, {
        email: email.trim(),
        method: "otp",
      });
      setMsg({ type: "success", text: "OTP sent to your email." });
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send OTP.";
      setMsg({ type: "error", text: apiMsg });
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!email.trim() || !otp.trim()) {
      setMsg({ type: "error", text: "Email and OTP are required." });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/verification/verify-otp`, {
        email: email.trim(),
        otp: otp.trim(),
      });

      setMsg({ type: "success", text: "Email verified! Redirecting to login..." });

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "OTP verification failed.";
      setMsg({ type: "error", text: apiMsg });
    } finally {
      setLoading(false);
    }
  };

  // Auto-send OTP if email was passed from register page
  useEffect(() => {
    if (location.state?.email) {
      sendOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Verify Email</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the OTP sent to your email.
        </p>

        {msg.text ? (
          <div
            className={`mt-4 text-sm rounded-md p-3 ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        ) : null}

        <form onSubmit={verifyOtp} className="space-y-3 mt-5">
          <div>
            <label className="text-sm">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="6-digit OTP"
              inputMode="numeric"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm bg-black text-white disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={sendOtp}
            disabled={sending}
            className="text-sm underline disabled:opacity-60"
          >
            {sending ? "Sending..." : "Resend OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
