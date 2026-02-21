// src/components/mentor/SkillsSection.jsx
const SkillsSection = ({ coreSkills = [], expertiseAreas = [] }) => {
  return (
    <div className="border rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-sm">Skills & Expertise</h3>

      {/* Core Skills */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Core Skills</p>
        <div className="flex flex-wrap gap-2">
          {coreSkills.length > 0 ? (
            coreSkills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400">No skills added</p>
          )}
        </div>
      </div>

      {/* Expertise Areas */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Expertise Areas</p>
        <div className="flex flex-wrap gap-2">
          {expertiseAreas.length > 0 ? (
            expertiseAreas.map((area) => (
              <span
                key={area}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
              >
                {area}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400">No expertise areas added</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;