import * as github from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { formatFooter, formatHeader } from './markdown';

type ListCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

export const publishComment = async (
  token: string,
  title: string,
  message: string,
  postNew: boolean
): Promise<void> => {
  const { owner, repo, issueNumber, commit } = getConfiguration();

  if (!token || !owner || !repo || !issueNumber) {
    console.log('Failed to post a comment');
    return;
  }

  const header = formatHeader(title);
  const footer = commit ? formatFooter(commit) : '';
  const body = `${header}${message}${footer}`;

  const issues = github.getOctokit(token).rest.issues;
  const comments = await issues.listComments({ owner, repo, issue_number: issueNumber });
  const existingComment = findExistingComment(comments, header);

  if (existingComment && !postNew) {
    await issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
  } else {
    await issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
};

const getConfiguration = () => {
  const {
    payload: { pull_request, repository, after }
  } = github.context;

  console.log('RUN ID', github.context.runId);
  console.log('RUN #', github.context.runNumber);
  console.log('JOB', github.context.job);
  console.log('WORKFLOW', github.context.workflow);

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
