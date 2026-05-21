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

  const chartConfig = {
    type: "radar",
    data: {
      labels: ["Repos", "PRs", "Issues", "Commits"],
      datasets: [
        {
          label: "GitHub Activity",
          data: [
            Math.round((repos / total) * 100),
            Math.round((prCount / total) * 100),
            Math.round((issueCount / total) * 100),
            Math.round((commits / total) * 100)
          ]
        }
      ]
    }
  };

  // IMPORTANT: SINGLE-LINE OUTPUT ONLY
  console.log(encodeURIComponent(JSON.stringify(chartConfig)));
}

getData();
