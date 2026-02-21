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

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Mentor Dashboard</h1>
            <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/onboarding/mentor")}
              className="text-sm border rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-sm border rounded-lg px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <ProfileCard user={user} profile={profile} />

        {/* Experience */}
        <ExperienceSection profile={profile} />

        {/* Skills */}
        <SkillsSection
          coreSkills={profile?.coreSkills}
          expertiseAreas={profile?.expertiseAreas}
        />

        {/* Mentorship Preferences */}
        <MentorshipPrefs profile={profile} />

        {/* Social Links */}
        <SocialLinks profile={profile} />

      </div>
    </div>
  );
};

export default MentorDashboard;