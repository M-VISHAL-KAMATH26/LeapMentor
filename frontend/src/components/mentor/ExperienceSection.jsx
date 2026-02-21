// src/components/mentor/ExperienceSection.jsx
const ExperienceSection = ({ profile }) => {
  return (
    <div className="border rounded-xl p-5 space-y-2">
      <h3 className="font-semibold text-sm">Experience</h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-400">Current Role</p>
          <p className="text-gray-700">{profile?.currentRole || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Company</p>
          <p className="text-gray-700">{profile?.currentCompany || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Industry</p>
          <p className="text-gray-700">{profile?.industry || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Years of Experience</p>
          <p className="text-gray-700">
            {profile?.yearsOfExperience !== undefined
              ? `${profile.yearsOfExperience} years`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;