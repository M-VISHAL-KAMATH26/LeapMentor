// src/components/mentor/ExperienceSection.jsx

const icons = {
  role: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  company: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  industry: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20M6 20V10l6-6 6 6v10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
  years: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

const StatItem = ({ icon, label, value }) => (
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
    <div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
    </div>
  </div>
);

const ExperienceSection = ({ profile }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "#685fff" }}
        />
        <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
          Experience
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={icons.role}
          label="Current Role"
          value={profile?.currentRole}
        />
        <StatItem
          icon={icons.company}
          label="Company"
          value={profile?.currentCompany}
        />
        <StatItem
          icon={icons.industry}
          label="Industry"
          value={profile?.industry}
        />
        <StatItem
          icon={icons.years}
          label="Years of Experience"
          value={
            profile?.yearsOfExperience !== undefined
              ? `${profile.yearsOfExperience} yrs`
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ExperienceSection;