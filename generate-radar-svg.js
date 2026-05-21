const username = process.env.GITHUB_USERNAME;

async function getData() {
  const user = await fetch(`https://api.github.com/users/${username}`).then(r => r.json());

  const prs = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`).then(r => r.json());
  const issues = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`).then(r => r.json());

  const repos = user.public_repos || 0;
  const prCount = prs.total_count || 0;
  const issueCount = issues.total_count || 0;
  const commits = prCount * 3;

  const total = repos + prCount + issueCount + commits || 1;

  return {
    repos: Math.round((repos / total) * 100),
    prs: Math.round((prCount / total) * 100),
    issues: Math.round((issueCount / total) * 100),
    commits: Math.round((commits / total) * 100),
  };
}

function bar(label, value) {
  const blocks = Math.round(value / 10);
  const filled = "█".repeat(blocks);
  const empty = "░".repeat(10 - blocks);
  return `${label.padEnd(10)} ${filled}${empty} ${value}%`;
}

getData().then(stats => {
  const svg = `
<svg width="500" height="220" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 18px sans-serif; fill: #111; }
    .text { font: 14px monospace; fill: #333; }
    .card { fill: #f8f9fb; stroke: #ddd; stroke-width: 1; }
  </style>

  <rect x="0" y="0" width="500" height="220" rx="12" class="card"/>

  <text x="20" y="30" class="title">GitHub Radar</text>

  <text x="20" y="70" class="text">${bar("Repos", stats.repos)}</text>
  <text x="20" y="100" class="text">${bar("PRs", stats.prs)}</text>
  <text x="20" y="130" class="text">${bar("Issues", stats.issues)}</text>
  <text x="20" y="160" class="text">${bar("Commits", stats.commits)}</text>
</svg>
`;

  console.log(svg.trim());
});
