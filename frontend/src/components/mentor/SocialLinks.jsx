// src/components/mentor/SocialLinks.jsx

const socialConfig = {
  LinkedIn: {
    color: "#0a66c2",
    bg: "#e8f0fb",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  Portfolio: {
    color: "#685fff",
    bg: "#f0eeff",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  GitHub: {
    color: "#24292f",
    bg: "#f0f0f0",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  Twitter: {
    color: "#1d9bf0",
    bg: "#e7f3fd",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
};

const SocialLinks = ({ profile }) => {
  const links = [
    { label: "LinkedIn", url: profile?.linkedInUrl },
    { label: "Portfolio", url: profile?.portfolioUrl },
    { label: "GitHub", url: profile?.githubUrl },
    { label: "Twitter", url: profile?.twitterUrl },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full" style={{ background: "#685fff" }} />
        <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
          Social Links
        </h3>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2">
        {links.map((link) => {
          const config = socialConfig[link.label] || {
            color: "#685fff",
            bg: "#f7f6ff",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            ),
          };

          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-4 py-3 group transition-all duration-150 no-underline"
              style={{ background: config.bg }}
            >
              {/* Icon */}
              <span style={{ color: config.color }}>{config.icon}</span>

              {/* Label + URL */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: config.color }}>
                  {link.label}
                </p>
                <p className="text-xs text-gray-400 truncate">{link.url}</p>
              </div>

              {/* Arrow */}
              <svg
                width="13" height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={config.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;