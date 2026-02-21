// src/components/mentor/ProfileCard.jsx
const ProfileCard = ({ user, profile }) => {
  return (
    <div className="border rounded-xl p-5 flex items-start gap-4">
      {/* Photo */}
      <img
        src={profile?.profilePhoto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "M")}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border"
      />

      {/* Info */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{user?.name}</h2>
        <p className="text-sm text-gray-500">{profile?.headline || "No headline added"}</p>
        <p className="text-sm text-gray-400">{user?.email}</p>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {profile?.bio || "No bio added yet."}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;