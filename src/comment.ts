import * as github from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type ListCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

export const publishComment = async (token: string, title: string, message: string) => {
  const {
    payload: { pull_request, repository }
  } = github.context;

  console.dir(github.context, { depth: 8 });

  const octokit = github.getOctokit(token);
  const issueNumber = pull_request?.number;
  const [owner, repo] = repository?.full_name?.split('/') || [];

  if (!owner || !repo || !issueNumber) {
    console.error('Failed to post a comment');
    return;
  }

  const header = `## ${title}`;
  const body = `${header}\n${message}`;

  const comments = await octokit.rest.issues.listComments({ owner, repo, issue_number: issueNumber });
  const existingComment = findExistingComment(comments, header);

  if (existingComment) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
};

const findExistingComment = (comments: ListCommentsResponse, header: string) =>
  comments.data.find(comment => comment.user?.type === 'Bot' && comment.body?.startsWith(header));
