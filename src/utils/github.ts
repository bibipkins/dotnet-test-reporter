import { context } from '@actions/github/lib/github';
import { log } from './action';

export interface IContext {
  owner: string;
  repo: string;
  sha: string;
  issueNumber: number;
  runId: number;
}

export const getContext = (): IContext => {
  log(`Reading GitHub context...`);

  const {
    runId,
    payload: { pull_request, repository, after }
  } = context;

  const issueNumber = pull_request?.number ?? -1;
  const [owner, repo] = repository?.full_name?.split('/') || [];
  const sha = pull_request?.head?.sha || after || context.sha;

  return { owner, repo, sha, issueNumber, runId };
};
