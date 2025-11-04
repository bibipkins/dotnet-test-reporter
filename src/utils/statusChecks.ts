import { context, getOctokit } from '@actions/github/lib/github';
import type { IResult } from '../data';
import { log } from './action';

interface IContext {
  owner: string;
  repo: string;
  sha: string;
}

export const createTestStatusCheck = async (
  token: string,
  result: IResult,
  formattedSummary: string,
  title: string
): Promise<void> => {
  const { owner, repo, sha } = getContext();

  if (!token || !owner || !repo || !sha) {
    log('Failed to create status check - missing required context');
    return;
  }

  const octokit = getOctokit(token);
  const { success } = result;

  const conclusion = success ? 'success' : 'failure';
  const status = 'completed';
  const name = `${title} - Tests`;
  try {
    log(`Creating test status check: ${name}`);
    await octokit.rest.checks.create({
      owner,
      repo,
      name,
      head_sha: sha,
      status,
      conclusion,
      output: {
        title: `Test Results`,
        summary: formattedSummary
      }
    });
    log(`Successfully created test status check`);
  } catch (error) {
    log(`Failed to create test status check: ${(error as Error).message}`);
  }
};

const getContext = (): IContext => {
  log(`Reading context for status checks...`);

  const {
    payload: { pull_request, repository, after }
  } = context;

  // For PR events, use the head SHA; for push events, use the after SHA  
  const sha = pull_request?.head?.sha || after || context.sha;
  const [owner, repo] = repository?.full_name?.split('/') || [];

  return { owner, repo, sha };
};