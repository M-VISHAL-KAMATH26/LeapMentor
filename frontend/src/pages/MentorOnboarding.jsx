// src/pages/MentorOnboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ── Reusable field components ──────────────────────────────────────────────

const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
    {children}
    {required && <span className="text-[#685fff] ml-0.5">*</span>}
  </label>
);

const inputClass =
  "w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none placeholder:text-gray-300 focus:border-[#685fff] focus:ring-2 focus:ring-[#685fff20] transition-all duration-150";

const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Section header */}
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ background: "#685fff" }}
      >
        {icon}
      </div>
      <h2 className="text-sm font-bold text-gray-800">{title}</h2>
    </div>
    <div className="px-6 py-5 space-y-4">{children}</div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

const MentorOnboarding = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    industry: "",
    yearsOfExperience: "",
    currentRole: "",
    currentCompany: "",
    coreSkills: "",
    expertiseAreas: "",
    linkedInUrl: "",
    portfolioUrl: "",
    githubUrl: "",
    mentorshipStyle: "",
    availabilityHours: "",
    preferredCommunication: "",
    languages: "",
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
    if (!token) { navigate("/login"); return; }

    try {
      setLoading(true);
      const payload = {
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience),
        availabilityHours: Number(form.availabilityHours),
        coreSkills: form.coreSkills.split(",").map((s) => s.trim()).filter(Boolean),
        expertiseAreas: form.expertiseAreas.split(",").map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      };

      await axios.post(`${BASE_URL}/api/mentor-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg({ type: "success", text: "Profile saved! Redirecting to dashboard…" });
      setTimeout(() => navigate("/dashboard/mentor"), 1000);
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong.";
      setMsg({ type: "error", text: apiMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">

      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #685fff, #a78bfa)" }}
      />

      {/* Sticky nav */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "#685fff", boxShadow: "0 4px 12px #685fff35" }}
            >
              M
            </div>
            <span className="text-sm font-bold text-gray-900">Mentor Setup</span>
          </div>
          <button
            onClick={() => navigate("/dashboard/mentor")}
            className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </header>

      {/* Page header */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-2">
        <h1 className="text-xl font-bold text-gray-900">Complete Your Profile</h1>
        <p className="text-sm text-gray-400 mt-1">
          Help mentees find and connect with the right mentor — you.
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="h-1 rounded-full flex-1 transition-all"
              style={{ background: s === 1 ? "#685fff" : "#e5e7eb" }}
            />
          ))}
        </div>
      </div>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── About You ── */}
          <SectionCard
            title="About You"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          >
            <div>
              <Label required>Headline</Label>
              <input
                name="headline"
                value={form.headline}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Senior Engineer at Google"
                required
              />
            </div>
            <div>
              <Label required>Bio</Label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className={inputClass + " resize-none"}
                placeholder="Tell mentees about your journey and what you offer…"
                rows={4}
                required
              />
            </div>
          </SectionCard>

          {/* ── Professional Info ── */}
          <SectionCard
            title="Professional Info"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Current Role</Label>
                <input
                  name="currentRole"
                  value={form.currentRole}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Product Manager"
                  required
                />
              </div>
              <div>
                <Label>Company</Label>
                <input
                  name="currentCompany"
                  value={form.currentCompany}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Spotify"
                />
              </div>
              <div>
                <Label required>Industry</Label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Technology"
                  required
                />
              </div>
              <div>
                <Label required>Years of Experience</Label>
                <input
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  max="60"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 8"
                  required
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Skills & Expertise ── */}
          <SectionCard
            title="Skills & Expertise"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          >
            <div>
              <Label required>Core Skills</Label>
              <input
                name="coreSkills"
                value={form.coreSkills}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. React, Node.js, System Design"
                required
              />
              <p className="text-xs text-gray-400 mt-1.5">Separate with commas</p>
            </div>
            <div>
              <Label>Expertise Areas</Label>
              <input
                name="expertiseAreas"
                value={form.expertiseAreas}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Career Growth, Leadership, Startups"
              />
              <p className="text-xs text-gray-400 mt-1.5">Separate with commas</p>
            </div>
          </SectionCard>

          {/* ── Mentorship Preferences ── */}
          <SectionCard
            title="Mentorship Preferences"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mentorship Style</Label>
                <select
                  name="mentorshipStyle"
                  value={form.mentorshipStyle}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select style</option>
                  <option value="1-on-1">1-on-1</option>
                  <option value="Group">Group</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <Label>Availability (hrs/week)</Label>
                <input
                  name="availabilityHours"
                  type="number"
                  min="0"
                  max="40"
                  value={form.availabilityHours}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <Label>Preferred Communication</Label>
                <select
                  name="preferredCommunication"
                  value={form.preferredCommunication}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select channel</option>
                  <option value="Video Call">Video Call</option>
                  <option value="Chat">Chat</option>
                  <option value="Email">Email</option>
                </select>
              </div>
              <div>
                <Label>Languages</Label>
                <input
                  name="languages"
                  value={form.languages}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. English, Hindi"
                />
                <p className="text-xs text-gray-400 mt-1.5">Separate with commas</p>
              </div>
            </div>
          </SectionCard>

          {/* ── Social Links ── */}
          <SectionCard
            title="Social Links"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            }
          >
            {[
              { name: "linkedInUrl", placeholder: "https://linkedin.com/in/yourname", label: "LinkedIn URL" },
              { name: "portfolioUrl", placeholder: "https://yourportfolio.com", label: "Portfolio URL" },
              { name: "githubUrl", placeholder: "https://github.com/yourusername", label: "GitHub URL" },
            ].map(({ name, placeholder, label }) => (
              <div key={name}>
                <Label>{label}</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className={inputClass + " pl-9"}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}
          </SectionCard>

          {/* ── Status message ── */}
          {msg.text && (
            <div
              className={`flex items-center gap-2.5 text-sm rounded-xl px-4 py-3 border ${
                msg.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              <span className="text-base">{msg.type === "success" ? "✓" : "⚠"}</span>
              {msg.text}
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "#a78bfa"
                : "linear-gradient(135deg, #685fff 0%, #8b7fff 100%)",
              boxShadow: loading ? "none" : "0 4px 16px #685fff40",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Saving profile…
              </span>
            ) : (
              "Complete Profile →"
            )}
          </button>

          <p className="text-center text-xs text-gray-400 pb-8">
            You can always edit your profile from the dashboard.
          </p>

        </form>
      </main>
    </div>
  );
};

export default MentorOnboarding;