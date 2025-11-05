import { getOctokit } from '@actions/github/lib/github';
import { GitHub } from '@actions/github/lib/utils';
import { formatFooterMarkdown, formatHeaderMarkdown, formatSummaryLinkMarkdown } from '../formatting/markdown';
import { log } from './action';
import { getContext, IContext } from './github';

type Octokit = InstanceType<typeof GitHub>;

export const publishComment = async (
  token: string,
  serverUrl: string,
  title: string,
  message: string,
  postNew: boolean
): Promise<void> => {
  const context = getContext();
  const { owner, repo, runId, issueNumber, sha } = context;

  if (!token || !owner || !repo || issueNumber === -1) {
    log('Failed to post a comment');
    return;
  }

  const header = formatHeaderMarkdown(title);
  const octokit = getOctokit(token);
  const existingComment = await getExistingComment(octokit, context, header);
  const summaryLink = formatSummaryLinkMarkdown(serverUrl, owner, repo, runId, title);
  const footer = sha ? formatFooterMarkdown(sha) : '';
  const body = `${header}${message}${summaryLink}${footer}`;

  if (existingComment && !postNew) {
    log(`Updating existing PR comment...`);
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
  } else {
    log(`Publishing new PR comment...`);
    await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
};

const tryGetUserLogin = async (octokit: Octokit) => {
  try {
    const username = await octokit.rest.users.getAuthenticated();
    return username.data?.login;
  } catch {
    log('⚠️ Failed to get username without user scope, will check comment with user type instead');
    return undefined;
  }
};

const getExistingComment = async (octokit: Octokit, context: IContext, header: string) => {
  log(`Looking for existing PR comment...`);
  const { owner, repo, issueNumber } = context;
  const comments = await octokit.rest.issues.listComments({ owner, repo, issue_number: issueNumber });
  const userLogin = await tryGetUserLogin(octokit);

  return comments.data?.find(comment => {
    const isBotUserType = comment.user?.type === 'Bot' || comment.user?.login === userLogin;
    const startsWithHeader = comment.body?.startsWith(header);
    return isBotUserType && startsWithHeader;
  });
};
