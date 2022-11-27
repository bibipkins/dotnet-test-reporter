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

const outputs = {
  total: 'tests-total',
  passed: 'tests-passed',
  failed: 'tests-failed',
  skipped: 'tests-skipped',
  lineCoverage: 'coverage-line',
  linesTotal: 'coverage-lines-total',
  linesCovered: 'coverage-lines-covered',
  branchCoverage: 'coverage-branch',
  branchesTotal: 'coverage-branches-total',
  branchesCovered: 'coverage-branches-covered'
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
  core.setOutput(outputs.total, results.total);
  core.setOutput(outputs.passed, results.passed);
  core.setOutput(outputs.failed, results.failed);
  core.setOutput(outputs.skipped, results.skipped);
};

export const setCoverageOutputs = (coverage: ITestCoverage): void => {
  core.setOutput(outputs.lineCoverage, coverage.lineCoverage);
  core.setOutput(outputs.linesTotal, coverage.linesTotal);
  core.setOutput(outputs.linesCovered, coverage.linesCovered);
  core.setOutput(outputs.branchCoverage, coverage.branchCoverage);
  core.setOutput(outputs.branchesTotal, coverage.branchesTotal);
  core.setOutput(outputs.branchesCovered, coverage.branchesCovered);
};

export const setActionFailed = (message: string): void => {
  core.setFailed(message);
};
