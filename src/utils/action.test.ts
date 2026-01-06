import * as core from '@actions/core';
import { getInputs, setResultOutputs, setCoverageOutputs, setFailed, setSummary, log } from './action';
import { ICoverage, IResult } from '../data';

const mockInputs: Record<string, string> = {
  'github-token': 'test-token',
  'comment-title': 'My Title',
  'results-path': 'results.xml',
  'coverage-path': 'coverage.xml',
  'coverage-type': 'opencover',
  'coverage-threshold': '75',
  'server-url': 'https://example.com',
  'pull-request-check-name': 'check-name',
  'changed-files-and-line-numbers': JSON.stringify([{ name: 'file1', lineNumbers: [1, 2] }])
};

const mockBooleanInputs: Record<string, boolean> = {
  'post-new-comment': true,
  'allow-failed-tests': true,
  'show-failed-tests-only': true,
  'show-test-output': true,
  'pull-request-check': true
};

jest.mock('@actions/core', () => ({
  summary: { addRaw: jest.fn() },
  getInput: jest.fn().mockImplementation((name: string) => mockInputs[name]),
  getBooleanInput: jest.fn().mockImplementation((name: string) => mockBooleanInputs[name]),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  info: jest.fn()
}));

describe('action utils', () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'env-token';
  });

  describe('getInputs', () => {
    it('returns token from environment when token input is empty', () => {
      (core.getInput as jest.Mock).mockReturnValueOnce('');
      const inputs = getInputs();
      expect(inputs.token).toBe('env-token');
    });

    it('returns token input when it is not empty', () => {
      const inputs = getInputs();
      expect(inputs.token).toBe('test-token');
    });

    it('returns empty string when input token and environment token are empty', () => {
      (core.getInput as jest.Mock).mockReturnValueOnce('');
      process.env.GITHUB_TOKEN = '';
      const inputs = getInputs();
      expect(inputs.token).toBe('');
    });

    it('returns title input', () => {
      const inputs = getInputs();
      expect(inputs.title).toBe('My Title');
    });

    it('returns resultsPath input', () => {
      const inputs = getInputs();
      expect(inputs.resultsPath).toBe('results.xml');
    });

    it('returns coveragePath input', () => {
      const inputs = getInputs();
      expect(inputs.coveragePath).toBe('coverage.xml');
    });

    it('returns coverageType input', () => {
      const inputs = getInputs();
      expect(inputs.coverageType).toBe('opencover');
    });

    it('returns coverageThreshold input as number', () => {
      const inputs = getInputs();
      expect(inputs.coverageThreshold).toBe(75);
    });

    it('returns postNewComment input as boolean', () => {
      const inputs = getInputs();
      expect(inputs.postNewComment).toBe(true);
    });

    it('returns allowFailedTests input as boolean', () => {
      const inputs = getInputs();
      expect(inputs.allowFailedTests).toBe(true);
    });

    it('returns showFailedTestsOnly input as boolean', () => {
      const inputs = getInputs();
      expect(inputs.showFailedTestsOnly).toBe(true);
    });

    it('returns showTestOutput input as boolean', () => {
      const inputs = getInputs();
      expect(inputs.showTestOutput).toBe(true);
    });

    it('returns pullRequestCheck input as boolean', () => {
      const inputs = getInputs();
      expect(inputs.pullRequestCheck).toBe(true);
    });

    it('returns serverUrl input', () => {
      const inputs = getInputs();
      expect(inputs.serverUrl).toBe('https://example.com');
    });

    it('returns pullRequestCheckName input', () => {
      const inputs = getInputs();
      expect(inputs.pullRequestCheckName).toBe('check-name');
    });

    it('parses changed files JSON input into ChangedFile array', () => {
      const inputs = getInputs();
      expect(inputs.changedFiles).toEqual([{ name: 'file1', lineNumbers: [1, 2] }]);
    });
  });

  describe('setResultOutputs', () => {
    it('calls core.setOutput for each result field', () => {
      setResultOutputs({ total: 10, passed: 7, failed: 2, skipped: 1 } as IResult);

      expect(core.setOutput).toHaveBeenCalledWith('tests-total', 10);
      expect(core.setOutput).toHaveBeenCalledWith('tests-passed', 7);
      expect(core.setOutput).toHaveBeenCalledWith('tests-failed', 2);
      expect(core.setOutput).toHaveBeenCalledWith('tests-skipped', 1);
    });
  });

  describe('setCoverageOutputs', () => {
    it('calls core.setOutput for each coverage metric', () => {
      setCoverageOutputs({
        lineCoverage: 82.5,
        linesTotal: 200,
        linesCovered: 165,
        branchCoverage: 50,
        branchesTotal: 20,
        branchesCovered: 10
      } as ICoverage);

      expect(core.setOutput).toHaveBeenCalledWith('coverage-line', 82.5);
      expect(core.setOutput).toHaveBeenCalledWith('coverage-lines-total', 200);
      expect(core.setOutput).toHaveBeenCalledWith('coverage-lines-covered', 165);
      expect(core.setOutput).toHaveBeenCalledWith('coverage-branch', 50);
      expect(core.setOutput).toHaveBeenCalledWith('coverage-branches-total', 20);
      expect(core.setOutput).toHaveBeenCalledWith('coverage-branches-covered', 10);
    });
  });

  describe('setFailed', () => {
    it('calls core.setFailed', () => {
      setFailed('some error');
      expect(core.setFailed).toHaveBeenCalledWith('some error');
    });
  });

  describe('setSummary', () => {
    it('adds and writes the summary and logs info', async () => {
      const writeMock = jest.fn().mockResolvedValue(undefined);
      (core.summary.addRaw as jest.Mock).mockReturnValue({ write: writeMock });

      await setSummary('<h1>summary</h1>');

      expect(core.info).toHaveBeenCalledWith('Setting action summary...');
      expect(core.summary.addRaw).toHaveBeenCalledWith('<h1>summary</h1>');
      expect(writeMock).toHaveBeenCalled();
    });
  });

  describe('log', () => {
    it('calls core.info', () => {
      log('hello');
      expect(core.info).toHaveBeenCalledWith('hello');
    });
  });
});
