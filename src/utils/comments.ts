import { GitHub } from '@actions/github/lib/utils';
import { getOctokit, context } from '@actions/github/lib/github';
import { formatFooter, formatHeader, formatSummaryLink } from './markdown';

type Octokit = InstanceType<typeof GitHub>;

interface IContext {
  owner: string;
  repo: string;
  commit: string;
  issueNumber: number;
  runId: number;
  jobName: string;
}

export const publishComment = async (
  token: string,
  title: string,
  message: string,
  postNew: boolean
): Promise<void> => {
  const context = getContext();
  const { owner, repo, runId, issueNumber, commit } = context;

  if (!token || !owner || !repo || issueNumber === -1) {
    console.log('Failed to post a comment');
    return;
  }

  const header = formatHeader(title);
  const octokit = getOctokit(token);
  const currentJob = await getCurrentJob(octokit, context);
  const existingComment = await getExistingComment(octokit, context, header);

  const summaryLink = currentJob ? formatSummaryLink(owner, repo, runId, currentJob.id) : '';
  const footer = commit ? formatFooter(commit) : '';
  const body = `${header}${message}${summaryLink}${footer}`;

  if (existingComment && !postNew) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
};

const getContext = (): IContext => {
  const {
    job,
    runId,
    payload: { pull_request, repository, after }
  } = context;

  const issueNumber = pull_request?.number ?? -1;
  const [owner, repo] = repository?.full_name?.split('/') || [];

  return { owner, repo, issueNumber, commit: after, runId, jobName: job };
};

const getCurrentJob = async (octokit: Octokit, context: IContext) => {
  const { owner, repo, runId, jobName } = context;
  const jobs = await octokit.rest.actions.listJobsForWorkflowRun({ owner, repo, run_id: runId });

  return jobs.data?.jobs?.find(job => job.name === jobName);
};

const getExistingComment = async (octokit: Octokit, context: IContext, header: string) => {
  const { owner, repo, issueNumber } = context;
  const comments = await octokit.rest.issues.listComments({ owner, repo, issue_number: issueNumber });

  return comments.data?.find(comment => {
    const isBotUserType = comment.user?.type === 'Bot';
    const startsWithHeader = comment.body?.startsWith(header);

    return isBotUserType && startsWithHeader;
  });
};
