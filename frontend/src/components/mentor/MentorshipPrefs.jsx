// src/components/mentor/MentorshipPrefs.jsx
const MentorshipPrefs = ({ profile }) => {
  return (
    <div className="border rounded-xl p-5 space-y-2">
      <h3 className="font-semibold text-sm">Mentorship Preferences</h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-400">Style</p>
          <p className="text-gray-700">{profile?.mentorshipStyle || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Availability</p>
          <p className="text-gray-700">
            {profile?.availabilityHours
              ? `${profile.availabilityHours} hrs/week`
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Preferred Communication</p>
          <p className="text-gray-700">{profile?.preferredCommunication || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Languages</p>
          <p className="text-gray-700">
            {profile?.languages?.join(", ") || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPrefs;