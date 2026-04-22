// USE BUILT-IN FETCH (NODE 18+)
const username = process.env.GITHUB_USERNAME;

async function getData() {
  const user = await fetch(`https://api.github.com/users/${username}`).then(res => res.json());

  const repos = user.public_repos;

  const prs = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`)
    .then(res => res.json());

  const issues = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`)
    .then(res => res.json());

  const prCount = prs.total_count;
  const issueCount = issues.total_count;

  const commits = prCount * 3; // APPROXIMATION

  const total = repos + prCount + issueCount + commits;

  return {
    repos: Math.round((repos / total) * 100),
    prs: Math.round((prCount / total) * 100),
    issues: Math.round((issueCount / total) * 100),
    commits: Math.round((commits / total) * 100)
  };
}

getData().then(stats => {

  const chartConfig = {
    type: 'radar',
    data: {
      labels: ['Repos', 'PRs', 'Issues', 'Commits'],
      datasets: [{
        label: 'GitHub Activity',
        data: [stats.repos, stats.prs, stats.issues, stats.commits]
      }]
    }
  };

  // 🔥 THIS IS THE FIX
  const encoded = encodeURIComponent(JSON.stringify(chartConfig));

  const chartURL = `https://quickchart.io/chart?c=${encoded}`;

  console.log(chartURL);
});
