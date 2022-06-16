import * as github from '@actions/github';

export const publishComment = (token: string) => {
  const {
    payload: { pull_request, repository }
  } = github.context;

  const octokit = github.getOctokit(token);
  const issueNumber = pull_request?.number;
  const [owner, repo] = repository?.full_name?.split('/') || [];

  console.log(`Owner: ${owner} Repo: ${repo} Issue: ${issueNumber}`);

  if (!owner || !repo || !issueNumber) {
    return;
  }

  octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: 'Test Comment' });
};
