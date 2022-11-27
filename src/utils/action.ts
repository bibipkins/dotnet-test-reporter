import * as core from '@actions/core';
import { IActionInputs, ITestCoverage, ITestResult } from '../data';

const inputs = {
  token: 'github-token',
  title: 'comment-title',
  postNewComment: 'post-new-comment',
  resultsPath: 'results-path',
  coveragePath: 'coverage-path',
  coverageThreshold: 'coverage-threshold'
};

export const getActionInputs = (): IActionInputs => {
  const token = core.getInput(inputs.token) || process.env['GITHUB_TOKEN'] || '';
  const title = core.getInput(inputs.title);
  const postNewComment = core.getBooleanInput(inputs.postNewComment);
  const resultsPath = core.getInput(inputs.resultsPath);
  const coveragePath = core.getInput(inputs.coveragePath);
  const coverageThreshold = Number(core.getInput(inputs.coverageThreshold));

  return { token, title, resultsPath, coveragePath, coverageThreshold, postNewComment };
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
