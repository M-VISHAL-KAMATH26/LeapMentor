// src/components/mentor/SocialLinks.jsx
const SocialLinks = ({ profile }) => {
  const links = [
    { label: "LinkedIn", url: profile?.linkedInUrl },
    { label: "Portfolio", url: profile?.portfolioUrl },
    { label: "GitHub", url: profile?.githubUrl },
    { label: "Twitter", url: profile?.twitterUrl },
  ].filter((l) => l.url); // only show links that exist

  if (links.length === 0) return null;

  return (
    <div className="border rounded-xl p-5 space-y-2">
      <h3 className="font-semibold text-sm">Social Links</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;