import { getOctokit } from '@actions/github/lib/github';
import { publishComment } from './comments';
import { getContext } from './github';
import { log } from './action';
import {
  formatFooterMarkdown,
  formatHeaderMarkdown,
  formatSummaryLinkMarkdown
} from '../formatting/markdown';

const rest = {
  issues: {
    listComments: jest.fn(),
    updateComment: jest.fn(),
    createComment: jest.fn()
  },
  users: {
    getAuthenticated: jest.fn()
  }
};

const context = {
  owner: 'owner',
  repo: 'repo',
  runId: 123,
  issueNumber: 7,
  sha: 'abcdef123456'
};

jest.mock('@actions/github/lib/github', () => ({ getOctokit: jest.fn() }));
jest.mock('./github', () => ({ getContext: jest.fn() }));
jest.mock('./action', () => ({ log: jest.fn() }));

describe('comments utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOctokit as jest.Mock).mockReturnValue({ rest: { ...rest } });
    (getContext as jest.Mock).mockReturnValue({ ...context });
  });

  describe('logs and returns when', () => {
    it('token is missing', async () => {
      await publishComment('', 'https://example.com', 'Title', 'Message', false);

      expect(log).toHaveBeenCalledWith('Failed to post a comment');
      expect(rest.issues.updateComment).not.toHaveBeenCalled();
      expect(rest.issues.createComment).not.toHaveBeenCalled();
    });

    it('owner is missing', async () => {
      (getContext as jest.Mock).mockReturnValue({ ...context, owner: '' });

      await publishComment('token', 'https://example.com', 'Title', 'Message', false);

      expect(log).toHaveBeenCalledWith('Failed to post a comment');
      expect(rest.issues.updateComment).not.toHaveBeenCalled();
      expect(rest.issues.createComment).not.toHaveBeenCalled();
    });

    it('repo is missing', async () => {
      (getContext as jest.Mock).mockReturnValue({ ...context, repo: '' });

      await publishComment('token', 'https://example.com', 'Title', 'Message', false);

      expect(log).toHaveBeenCalledWith('Failed to post a comment');
      expect(rest.issues.updateComment).not.toHaveBeenCalled();
      expect(rest.issues.createComment).not.toHaveBeenCalled();
    });

    it('invalid issue number', async () => {
      (getContext as jest.Mock).mockReturnValue({ ...context, issueNumber: -1 });

      await publishComment('token', 'https://example.com', 'Title', 'Message', false);

      expect(log).toHaveBeenCalledWith('Failed to post a comment');
      expect(rest.issues.updateComment).not.toHaveBeenCalled();
      expect(rest.issues.createComment).not.toHaveBeenCalled();
    });
  });

  it('updates existing comment when found and postNew is false', async () => {
    const testComment = {
      id: 99,
      body: '## Test Results\nOld message',
      user: { type: 'Bot', login: 'bot' }
    };

    rest.issues.listComments.mockResolvedValue({ data: [testComment] });
    rest.users.getAuthenticated.mockResolvedValue({ data: { login: 'bot' } });

    await publishComment('token', 'https://example.com', 'Test Results', 'All good', false);

    expect(log).toHaveBeenCalledWith('Updating existing PR comment...');
    expect(rest.issues.createComment).not.toHaveBeenCalled();
    expect(rest.issues.updateComment).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      comment_id: 99,
      body:
        '## Test Results\nAll good🔍 click [here]' +
        '(https://example.com/owner/repo/actions/runs/123#user-content-test-results) ' +
        'for more details\n<br/>_✏️ updated for commit abcdef1_'
    });
  });

  it('publishes new comment when no existing comment is found and postNew is false', async () => {
    rest.issues.listComments.mockResolvedValue({ data: [] });
    rest.users.getAuthenticated.mockResolvedValue({ data: { login: 'bot' } });

    await publishComment('token', 'https://example.com', 'Summary', 'New comment', false);

    expect(log).toHaveBeenCalledWith('Publishing new PR comment...');
    expect(rest.issues.updateComment).not.toHaveBeenCalled();
    expect(rest.issues.createComment).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 7,
      body:
        '## Summary\nNew comment🔍 click [here]' +
        '(https://example.com/owner/repo/actions/runs/123#user-content-summary) ' +
        'for more details\n<br/>_✏️ updated for commit abcdef1_'
    });
  });

  it('publishes new comment when existing comment is found and postNew is true', async () => {
    const testComment = {
      id: 99,
      body: '## Test Results\nOld comment',
      user: { type: 'Bot', login: 'bot' }
    };

    rest.issues.listComments.mockResolvedValue({ data: [testComment] });
    rest.users.getAuthenticated.mockResolvedValue({ data: { login: 'bot' } });

    await publishComment('token', 'https://example.com', 'Test Results', 'New comment', true);

    expect(log).toHaveBeenCalledWith('Publishing new PR comment...');
    expect(rest.issues.updateComment).not.toHaveBeenCalled();
    expect(rest.issues.createComment).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 7,
      body:
        '## Test Results\nNew comment🔍 click [here]' +
        '(https://example.com/owner/repo/actions/runs/123#user-content-test-results) ' +
        'for more details\n<br/>_✏️ updated for commit abcdef1_'
    });
  });

  it('falls back to bot user type when user login cannot be retrieved', async () => {
    const title = 'Run Results';
    const message = 'Details';
    const serverUrl = 'https://example.com';
    const header = formatHeaderMarkdown(title);
    const summaryLink = formatSummaryLinkMarkdown(serverUrl, 'owner', 'repo', 123, title);
    const footer = formatFooterMarkdown('abcdef123456');
    const body = `${header}${message}${summaryLink}${footer}`;

    rest.issues.listComments.mockResolvedValue({
      data: [
        {
          id: 14,
          body: `${header}Body`,
          user: { type: 'Bot', login: 'some-bot' }
        }
      ]
    });
    rest.users.getAuthenticated.mockRejectedValueOnce(new Error('No user scope'));

    await publishComment('token', serverUrl, title, message, false);

    expect(log).toHaveBeenCalledWith(
      '⚠️ Failed to get username without user scope, will check comment with user type instead'
    );
    expect(rest.issues.updateComment).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      comment_id: 14,
      body
    });
  });

  it('does not render footer when no commit SHA is provided', async () => {
    (getContext as jest.Mock).mockReturnValue({ ...context, sha: '' });

    const testComment = {
      id: 99,
      body: '## Test Results\nSome message',
      user: { type: 'Bot', login: 'bot' }
    };

    rest.issues.listComments.mockResolvedValue({ data: [testComment] });
    rest.users.getAuthenticated.mockResolvedValue({ data: { login: 'bot' } });

    await publishComment('token', 'https://example.com', 'Test Results', 'All good', false);

    expect(rest.issues.updateComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body:
          '## Test Results\nAll good🔍 click [here]' +
          '(https://example.com/owner/repo/actions/runs/123#user-content-test-results) ' +
          'for more details\n'
      })
    );
  });
});
