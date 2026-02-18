import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    try {
      setLoading(true);

      const BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: form.email.trim(),
        password: form.password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMsg({ type: "success", text: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/"); // redirect to home
      }, 800);

    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials";
      setMsg({ type: "error", text: apiMsg });
    } finally {
      setLoading(false);
    }
  };

  // Social placeholders (real OAuth later)
  const handleSocial = (provider) => {
    setMsg({
      type: "error",
      text: `${provider} login not wired yet (needs real OAuth flow).`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back to LeapMentor.
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

        {/* Social buttons */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => handleSocial("Google")}
            className="w-full border rounded-lg py-2 text-sm"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleSocial("LinkedIn")}
            className="w-full border rounded-lg py-2 text-sm"
          >
            Continue with LinkedIn
          </button>
          <button
            type="button"
            onClick={() => handleSocial("Apple")}
            className="w-full border rounded-lg py-2 text-sm"
          >
            Continue with Apple
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm bg-black text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/register/mentee")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
