// src/components/mentor/ProfileCard.jsx
const ProfileCard = ({ user, profile }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      
      {/* Top Banner */}
      <div
        className="h-20 rounded-xl mb-10 relative"
        style={{ background: "linear-gradient(135deg, #685fff 0%, #a78bfa 100%)" }}
      >
        {/* Avatar — overlapping the banner */}
        <div className="absolute -bottom-8 left-5">
          <img
            src={
              profile?.profilePhoto ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user?.name || "M") +
                "&background=685fff&color=fff&bold=true"
            }
            alt="Profile"
            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">
              {user?.name || "Mentor Name"}
            </h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#685fff" }}>
              {profile?.headline || "No headline added"}
            </p>
          </div>

          {/* Role badge */}
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full shrink-0 mt-0.5"
            style={{ background: "#f0eeff", color: "#685fff" }}
          >
            Mentor
          </span>
        </div>

        {/* Email row */}
        <div className="flex items-center gap-1.5 mt-2">
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="#9ca3af" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Bio */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {profile?.bio || "No bio added yet."}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;