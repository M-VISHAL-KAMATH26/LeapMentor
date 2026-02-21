// src/pages/MentorOnboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MentorOnboarding = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    industry: "",
    yearsOfExperience: "",
    currentRole: "",
    currentCompany: "",
    coreSkills: "",         // comma separated input → array on submit
    expertiseAreas: "",     // comma separated input → array on submit
    linkedInUrl: "",
    portfolioUrl: "",
    githubUrl: "",
    mentorshipStyle: "",
    availabilityHours: "",
    preferredCommunication: "",
    languages: "",          // comma separated input → array on submit
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Convert comma-separated strings to arrays
      const payload = {
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience),
        availabilityHours: Number(form.availabilityHours),
        coreSkills: form.coreSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        expertiseAreas: form.expertiseAreas
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        languages: form.languages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await axios.post(`${BASE_URL}/api/mentor-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg({ type: "success", text: "Profile created! Redirecting to dashboard..." });
      setTimeout(() => navigate("/dashboard/mentor"), 1000);
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong.";
      setMsg({ type: "error", text: apiMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Complete Your Mentor Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            This helps mentees find and connect with you.
          </p>
        </div>

        {msg.text && (
          <div
            className={`mb-4 text-sm rounded-md p-3 ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Core Identity ── */}
          <section className="border rounded-xl p-5 space-y-3">
            <h2 className="font-medium text-sm text-gray-700">About You</h2>

            <div>
              <label className="text-sm">Headline</label>
              <input
                name="headline"
                value={form.headline}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="e.g. Senior Engineer at Google"
                required
              />
            </div>

            <div>
              <label className="text-sm">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm resize-none"
                placeholder="Tell mentees about yourself, your journey and what you offer..."
                rows={4}
                required
              />
            </div>
          </section>

          {/* ── Professional Info ── */}
          <section className="border rounded-xl p-5 space-y-3">
            <h2 className="font-medium text-sm text-gray-700">Professional Info</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Current Role</label>
                <input
                  name="currentRole"
                  value={form.currentRole}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  placeholder="e.g. Product Manager"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Company</label>
                <input
                  name="currentCompany"
                  value={form.currentCompany}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  placeholder="e.g. Spotify"
                />
              </div>
              <div>
                <label className="text-sm">Industry</label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  placeholder="e.g. Technology"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Years of Experience</label>
                <input
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  max="60"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  placeholder="e.g. 8"
                  required
                />
              </div>
            </div>
          </section>

          {/* ── Skills ── */}
          <section className="border rounded-xl p-5 space-y-3">
            <h2 className="font-medium text-sm text-gray-700">Skills & Expertise</h2>

            <div>
              <label className="text-sm">Core Skills</label>
              <input
                name="coreSkills"
                value={form.coreSkills}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="e.g. React, Node.js, System Design"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="text-sm">Expertise Areas</label>
              <input
                name="expertiseAreas"
                value={form.expertiseAreas}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="e.g. Career Growth, Leadership, Startups"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>
          </section>

          {/* ── Mentorship Preferences ── */}
          <section className="border rounded-xl p-5 space-y-3">
            <h2 className="font-medium text-sm text-gray-700">Mentorship Preferences</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Mentorship Style</label>
                <select
                  name="mentorshipStyle"
                  value={form.mentorshipStyle}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                >
                  <option value="">Select</option>
                  <option value="1-on-1">1-on-1</option>
                  <option value="Group">Group</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Availability (hrs/week)</label>
                <input
                  name="availabilityHours"
                  type="number"
                  min="0"
                  max="40"
                  value={form.availabilityHours}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  placeholder="e.g. 3"
                />
              </div>

              <div>
                <label className="text-sm">Preferred Communication</label>
                <select
                  name="preferredCommunication"
                  value={form.preferredCommunication}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                >
                  <option value="">Select</option>
                  <option value="Video Call">Video Call</option>
                  <option value="Chat">Chat</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Languages</label>
                <input
                  name="languages"
                  value={form.languages}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  placeholder="e.g. English, Hindi"
                />
                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>
            </div>
          </section>

          {/* ── Social Links ── */}
          <section className="border rounded-xl p-5 space-y-3">
            <h2 className="font-medium text-sm text-gray-700">Social Links</h2>

            <div>
              <label className="text-sm">LinkedIn URL</label>
              <input
                name="linkedInUrl"
                value={form.linkedInUrl}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div>
              <label className="text-sm">Portfolio URL</label>
              <input
                name="portfolioUrl"
                value={form.portfolioUrl}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="text-sm">GitHub URL</label>
              <input
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm bg-black text-white disabled:opacity-60"
          >
            {loading ? "Saving profile..." : "Complete Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default MentorOnboarding;