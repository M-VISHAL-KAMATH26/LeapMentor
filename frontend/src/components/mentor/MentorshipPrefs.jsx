// src/components/mentor/MentorshipPrefs.jsx

const icons = {
  style: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  availability: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  communication: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  languages: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

const PrefItem = ({ icon, label, value }) => (
  <div
    className="flex items-start gap-3 rounded-xl p-4"
    style={{ background: "#f7f6ff" }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
      style={{ background: "#685fff", color: "#fff" }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
    </div>
  </div>
);

const MentorshipPrefs = ({ profile }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full" style={{ background: "#685fff" }} />
        <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
          Mentorship Preferences
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        <PrefItem
          icon={icons.style}
          label="Style"
          value={profile?.mentorshipStyle}
        />
        <PrefItem
          icon={icons.availability}
          label="Availability"
          value={
            profile?.availabilityHours
              ? `${profile.availabilityHours} hrs / week`
              : undefined
          }
        />
        <PrefItem
          icon={icons.communication}
          label="Preferred Communication"
          value={profile?.preferredCommunication}
        />
        <PrefItem
          icon={icons.languages}
          label="Languages"
          value={profile?.languages?.join(", ")}
        />
      </div>
    </div>
  );
};

export default MentorshipPrefs;