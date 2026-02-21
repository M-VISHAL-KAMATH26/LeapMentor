// src/components/mentor/SkillsSection.jsx

const SkillsSection = ({ coreSkills = [], expertiseAreas = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: "#685fff" }} />
        <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
          Skills & Expertise
        </h3>
      </div>

      <div className="space-y-5">

        {/* Core Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: "#685fff", color: "#fff" }}
            >
              Core
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {coreSkills.length > 0 ? `${coreSkills.length} skills` : "None added"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {coreSkills.length > 0 ? (
              coreSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
                  style={{
                    background: "#f7f6ff",
                    color: "#685fff",
                    borderColor: "#e0dbff",
                  }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No core skills added yet.</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Expertise Areas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: "#1e1b4b", color: "#fff" }}
            >
              Expertise
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {expertiseAreas.length > 0 ? `${expertiseAreas.length} areas` : "None added"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {expertiseAreas.length > 0 ? (
              expertiseAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border"
                  style={{
                    background: "#f0f0ff",
                    color: "#1e1b4b",
                    borderColor: "#c7d2fe",
                  }}
                >
                  {area}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No expertise areas added yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillsSection;