import * as core from '@actions/core';
import { IActionInputs, ITestCoverage, ITestResult } from '../data';

export const getActionInputs = (): IActionInputs => {
  const token = core.getInput('github-token') || process.env['GITHUB_TOKEN'] || '';
  const postNewComment = core.getBooleanInput('post-new-comment');

  const title = core.getInput('comment-title') || 'Test Results';
  const resultsPath = core.getInput('test-results');
  const coveragePath = core.getInput('test-coverage');
  const coverageThreshold = Number(core.getInput('min-coverage'));

  const configsJson = core.getInput('test-configs');
  const configs = JSON.parse(configsJson);

  return { token, title, resultsPath, coveragePath, coverageThreshold, postNewComment, configs };
};

export const setResultsOutputs = (results: ITestResult): void => {
  core.setOutput('tests-total', results.total);
  core.setOutput('tests-passed', results.passed);
  core.setOutput('tests-failed', results.failed);
  core.setOutput('tests-skipped', results.skipped);
};

export const setCoverageOutputs = (coverage: ITestCoverage): void => {
  core.setOutput('coverage-line', coverage.lineCoverage);
  core.setOutput('coverage-branch', coverage.branchCoverage);
};

export const setActionFailed = (message: string): void => {
  core.setFailed(message);
};
