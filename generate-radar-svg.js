const username = process.env.GITHUB_USERNAME;

function bar(value) {
  const blocks = Math.round(value / 10);
  return "█".repeat(blocks) + "░".repeat(10 - blocks);
}

async function getData() {
  const user = await fetch(`https://api.github.com/users/${username}`).then(r => r.json());

  const prs = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`).then(r => r.json());
  const issues = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`).then(r => r.json());

  const repos = user?.public_repos || 0;
  const prCount = prs?.total_count || 0;
  const issueCount = issues?.total_count || 0;
  const commits = prCount * 3;

  const total = Math.max(repos + prCount + issueCount + commits, 1);

  return {
    repos: Math.round((repos / total) * 100),
    prs: Math.round((prCount / total) * 100),
    issues: Math.round((issueCount / total) * 100),
    commits: Math.round((commits / total) * 100),
  };
}

getData()
  .then(stats => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="200">
  <rect width="100%" height="100%" fill="#0d1117" rx="12"/>

  <text x="20" y="30" fill="#ffffff" font-size="16">GitHub Radar</text>

  <text x="20" y="70" fill="#9ca3af" font-size="12">Repos   ${bar(stats.repos)} ${stats.repos}%</text>
  <text x="20" y="100" fill="#9ca3af" font-size="12">PRs     ${bar(stats.prs)} ${stats.prs}%</text>
  <text x="20" y="130" fill="#9ca3af" font-size="12">Issues  ${bar(stats.issues)} ${stats.issues}%</text>
  <text x="20" y="160" fill="#9ca3af" font-size="12">Commits ${bar(stats.commits)} ${stats.commits}%</text>
</svg>
`;

    console.log(svg.trim());
  })
  .catch(err => {
    console.error("FAILED TO GENERATE SVG:", err);
    process.exit(1);
  });
