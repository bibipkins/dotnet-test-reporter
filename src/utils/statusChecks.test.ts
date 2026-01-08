import * as github from '@actions/github/lib/github';
import { createTestStatusCheck } from './statusChecks';
import { log } from './action';

const createCheckMock = jest.fn().mockResolvedValue({});

jest.spyOn(github, 'getOctokit').mockReturnValue({
  rest: { checks: { create: createCheckMock as unknown } }
} as ReturnType<typeof github.getOctokit>);

jest.mock('./github', () => ({
  getContext: jest.fn().mockReturnValue({ owner: 'owner', repo: 'repo', sha: 'abc' })
}));

jest.mock('./action', () => ({ log: jest.fn() }));

describe('statusChecks utils', () => {
  it('logs and returns when token is missing', async () => {
    await createTestStatusCheck('', true, 'summary', 'check');
    expect(log).toHaveBeenCalledWith('Failed to create status check - missing required context');
  });

  it('creates a succeeded check when success is true', async () => {
    await createTestStatusCheck('token123', true, 'formatted summary', 'My Check');

    expect(log).toHaveBeenCalledWith('Creating test status check: My Check');
    expect(log).toHaveBeenCalledWith('Successfully created test status check');
    expect(createCheckMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'My Check',
      head_sha: 'abc',
      status: 'completed',
      conclusion: 'success',
      output: { title: `Test Results`, summary: 'formatted summary' }
    });
  });

  it('creates a failed check when success is false', async () => {
    await createTestStatusCheck('token123', false, 'failure summary', 'Failure Check');

    expect(createCheckMock).toHaveBeenCalledWith(
      expect.objectContaining({ conclusion: 'failure', name: 'Failure Check', head_sha: 'abc' })
    );
  });

  it('logs failure when octokit throws', async () => {
    createCheckMock.mockRejectedValueOnce(new Error('Network Error'));

    await createTestStatusCheck('token123', true, 'sum', 'ErrCheck');

    expect(log).toHaveBeenCalledWith('Creating test status check: ErrCheck');
    expect(log).toHaveBeenCalledWith('Failed to create test status check: Network Error');
  });
});
