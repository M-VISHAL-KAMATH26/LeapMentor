// src/pages/RegisterMentor.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const RegisterMentor = () => {
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const googleInitializedRef = useRef(false);

  // ✅ KEY FIX: mirror termsAccepted into a ref so the Google callback
  // always reads the latest value without needing to re-initialize
  const termsAcceptedRef = useRef(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // ✅ Keep ref in sync whenever checkbox changes
    if (name === "termsAccepted") {
      termsAcceptedRef.current = checked;
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  // ✅ Initialize Google ONCE only — callback reads from ref so it's never stale
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setMsg({ type: "error", text: "Missing VITE_GOOGLE_CLIENT_ID in frontend .env" });
      return;
    }

    const initGoogle = () => {
      if (!googleBtnRef.current) return;

      /* global google */
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            setMsg({ type: "", text: "" });

            // ✅ Read from ref — always latest, never stale
            if (!termsAcceptedRef.current) {
              setMsg({ type: "error", text: "Please accept the terms, then continue with Google." });
              return;
            }

            setLoading(true);

            const res = await axios.post(`${BASE_URL}/api/auth/google`, {
              credential: response.credential,
              roles: ["mentor"],
              termsAccepted: true,
            });

            if (res.data?.token) localStorage.setItem("token", res.data.token);

            console.log("✅ Google registration successful!", res.data);

            setMsg({ type: "success", text: "Google signup successful! Redirecting..." });
            setTimeout(() => navigate("/"), 700);
          } catch (err) {
            const apiMsg =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Google signup failed";
            setMsg({ type: "error", text: apiMsg });
          } finally {
            setLoading(false);
          }
        },
      });

      if (!googleInitializedRef.current) {
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
        });
        googleInitializedRef.current = true;
      }
    };

    // ✅ Handle script load timing safely
    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      script?.addEventListener("load", initGoogle);
      return () => script?.removeEventListener("load", initGoogle);
    }
  }, []); // ✅ empty deps — runs once, ref handles fresh values

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!form.termsAccepted) {
      setMsg({ type: "error", text: "Please accept the terms to continue." });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        roles: ["mentor"],
        termsAccepted: true,
      };

      const res = await axios.post(`${BASE_URL}/api/auth/register`, payload);

      if (res.data?.token) localStorage.setItem("token", res.data.token);

            console.log("✅ Google registration successful!", res.data);

      setMsg({ type: "success", text: "Registered successfully! Redirecting..." });
      setTimeout(() => {
        navigate("/verify-email", { state: { email: form.email.trim() } });
      }, 800);
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Try again.";
      setMsg({ type: "error", text: apiMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialPlaceholder = (provider) => {
    setMsg({ type: "info", text: `${provider} login coming soon.` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Register as Mentor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create your LeapMentor mentor account.
        </p>

        {msg.text ? (
          <div
            className={`mt-4 text-sm rounded-md p-3 ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : msg.type === "info"
                ? "bg-blue-50 text-blue-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        ) : null}

        <div className="mt-5 space-y-2">
          <div className={`${loading ? "opacity-60 pointer-events-none" : ""}`}>
            <div ref={googleBtnRef} className="w-full" />
          </div>

          <button
            type="button"
            onClick={() => handleSocialPlaceholder("LinkedIn")}
            className="w-full border rounded-lg py-2 text-sm"
            disabled={loading}
          >
            Continue with LinkedIn
          </button>
          <button
            type="button"
            onClick={() => handleSocialPlaceholder("Apple")}
            className="w-full border rounded-lg py-2 text-sm"
            disabled={loading}
          >
            Continue with Apple
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="••••••••"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          <label className="flex items-start gap-2 text-sm mt-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={form.termsAccepted}
              onChange={handleChange}
              className="mt-1"
            />
            <span>
              I agree to the{" "}
              <span className="underline cursor-pointer">Terms</span> and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm bg-black text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span className="underline cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterMentor;