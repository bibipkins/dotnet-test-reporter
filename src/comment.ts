import * as github from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type ListCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

export const publishComment = async (token: string, title: string, body: string) => {
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

  const comments = await octokit.rest.issues.listComments({ owner, repo, issue_number: issueNumber });
  const existingComment = findTestResultsComment(comments, title);
  console.dir(existingComment);

  const commentBody = `${title}\n${body}`;

  if (existingComment) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existingComment.id, body: commentBody });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: commentBody });
  }
};

const findTestResultsComment = (comments: ListCommentsResponse, title: string) =>
  comments.data.find(comment => comment.user?.type === 'Bot' && comment.body?.startsWith(title));
