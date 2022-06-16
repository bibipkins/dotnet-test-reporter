import * as github from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type ListCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

export const publishComment = async (token: string, title: string, message: string) => {
  const { owner, repo, issueNumber, commit: after } = getConfiguration();

  if (!owner || !repo || !issueNumber) {
    console.error('Failed to post a comment');
    return;
  }

  const header = `## ${title}`;
  const footer = after ? `:pencil2: updated for commit ${after.substring(0, 8)}` : '';
  const body = `${header}\n${message}<br/><br/><br/>${footer}`;

  const issues = github.getOctokit(token).rest.issues;
  const comments = await issues.listComments({ owner, repo, issue_number: issueNumber });
  const existingComment = findExistingComment(comments, header);

  if (existingComment) {
    await issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
  } else {
    await issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
};

const getConfiguration = () => {
  const {
    payload: { pull_request, repository, after }
  } = github.context;

  const issueNumber = pull_request?.number;
  const [owner, repo] = repository?.full_name?.split('/') || [];

  return { owner, repo, issueNumber, commit: after };
};

const findExistingComment = (comments: ListCommentsResponse, header: string) => {
  return comments.data.find(comment => {
    const isBotUserType = comment.user?.type === 'Bot';
    const startsWithHeader = comment.body?.startsWith(header);

    return isBotUserType && startsWithHeader;
  });
};
