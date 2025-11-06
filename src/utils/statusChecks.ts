import { getOctokit } from '@actions/github/lib/github';
import { log } from './action';
import { getContext } from './github';

export const createTestStatusCheck = async (
  token: string,
  success: boolean,
  formattedSummary: string,
  checkName: string
): Promise<void> => {
  const { owner, repo, sha } = getContext();

  if (!token || !owner || !repo || !sha) {
    log('Failed to create status check - missing required context');
    return;
  }

  const octokit = getOctokit(token);

  const conclusion = success ? 'success' : 'failure';
  const status = 'completed';
  const name = checkName;
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
