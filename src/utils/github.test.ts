import { PayloadRepository } from '@actions/github/lib/interfaces';
import { context } from '@actions/github/lib/github';
import { getContext } from './github';
import * as action from './action';

const logMock = jest.fn();

jest.mock('./action');
jest.mock('@actions/github/lib/github', () => ({
  context: { runId: 0, sha: '', payload: {} }
}));

describe('github utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (action.log as jest.Mock) = logMock;
    context.runId = 123456;
    context.sha = 'context-sha';
    context.payload = {
      after: 'after-sha',
      pull_request: {
        number: 42,
        head: { sha: 'pr-head-sha' }
      },
      repository: {
        full_name: 'owner-name/repo-name'
      } as PayloadRepository
    };
  });

  it('returns context with pull request data', () => {
    const result = getContext();

    expect(logMock).toHaveBeenCalledWith('Reading GitHub context...');
    expect(result).toEqual({
      owner: 'owner-name',
      repo: 'repo-name',
      sha: 'pr-head-sha',
      issueNumber: 42,
      runId: 123456
    });
  });

  it('handles missing repository data', () => {
    context.payload = {};

    const result = getContext();

    expect(result).toEqual({
      owner: undefined,
      repo: undefined,
      issueNumber: -1,
      runId: 123456,
      sha: 'context-sha'
    });
  });

  it('falls back sha to after when no pull_request', () => {
    context.payload.pull_request = undefined;
    const result = getContext();
    expect(result.sha).toEqual('after-sha');
  });

  it('falls back sha to context.sha when no pull_request or after', () => {
    context.payload.after = undefined;
    context.payload.pull_request = undefined;
    const result = getContext();
    expect(result.sha).toEqual('context-sha');
  });
});
