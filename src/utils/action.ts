import * as core from '@actions/core';
import { IActionInputs, ITestCoverage, ITestResult } from '../data';

export const getActionInputs = (): IActionInputs => {
  const token = core.getInput('github-token') || process.env['GITHUB_TOKEN'] || '';
  const title = core.getInput('comment-title') || 'Test Results';
  const resultsPath = core.getInput('test-results');
  const coveragePath = core.getInput('test-coverage');
  const minCoverage = Number(core.getInput('min-coverage'));
  const postNewComment = core.getBooleanInput('post-new-comment');

  const groups = core.getMultilineInput('groups');
  console.log(groups);

  const groups1 = core.getInput('groups');
  console.log(groups1);

  return { token, title, resultsPath, coveragePath, minCoverage, postNewComment };
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
