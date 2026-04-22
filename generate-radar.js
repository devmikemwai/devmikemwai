// FETCH DATA FROM GITHUB API
const username = process.env.GITHUB_USERNAME;

async function getData() {
  const user = await fetch(`https://api.github.com/users/${username}`).then(res => res.json());

  const repos = user.public_repos;

  // PR count
  const prs = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`)
    .then(res => res.json());

  const prCount = prs.total_count;

  // Issues count
  const issues = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`)
    .then(res => res.json());

  const issueCount = issues.total_count;

  // FAKE commits workaround (GitHub API limitation)
  const commits = prCount * 3;

  const total = repos + prCount + issueCount + commits;

  return {
    repos: Math.round((repos / total) * 100),
    prs: Math.round((prCount / total) * 100),
    issues: Math.round((issueCount / total) * 100),
    commits: Math.round((commits / total) * 100)
  };
}

getData().then(stats => {
  const chartURL = `https://quickchart.io/chart?c={
    type:'radar',
    data:{
      labels:['Repos','PRs','Issues','Commits'],
      datasets:[{data:[${stats.repos},${stats.prs},${stats.issues},${stats.commits}]}]
    }
  }`;

  console.log(chartURL);
});
