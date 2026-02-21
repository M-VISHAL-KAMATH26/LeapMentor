// src/pages/MentorDashboard.jsx
import { useNavigate } from "react-router-dom";
import useMentorDashboard from "../hooks/useMentorDashboard";
import ProfileCard from "../components/mentor/ProfileCard";
import SkillsSection from "../components/mentor/SkillsSection";
import ExperienceSection from "../components/mentor/ExperienceSection";
import SocialLinks from "../components/mentor/SocialLinks";
import MentorshipPrefs from "../components/mentor/MentorshipPrefs";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, error } = useMentorDashboard();

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-[#f0eeff] border-t-[#685fff] animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
          <span className="text-red-500 text-lg">⚠</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">

      {/* ── Top accent bar ── */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #685fff, #a78bfa)" }}
      />

      {/* ── Sticky Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
              style={{ background: "#685fff", boxShadow: "0 4px 14px #685fff35" }}
            >
              M
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">
                Mentor Dashboard
              </h1>
              <p className="text-xs text-gray-400 leading-tight">
                Welcome back,{" "}
                <span className="font-semibold text-gray-500">{user?.name}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/onboarding/mentor")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-[#685fff] hover:text-[#685fff] hover:bg-[#f0eeff] transition-all duration-150 cursor-pointer"
            >
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-red-100 bg-white text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-150 cursor-pointer"
            >
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">
            <ProfileCard user={user} profile={profile} />
            <SocialLinks profile={profile} />
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-5">
            <ExperienceSection profile={profile} />
            <SkillsSection
              coreSkills={profile?.coreSkills}
              expertiseAreas={profile?.expertiseAreas}
            />
            <MentorshipPrefs profile={profile} />
          </div>

        </div>
      </main>

    </div>
  );
};

export default MentorDashboard;