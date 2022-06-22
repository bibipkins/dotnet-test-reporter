import * as core from '@actions/core';
import { IActionInputs, ITestCoverage, ITestResult } from '../data';

export const getActionInputs = (): IActionInputs => {
  const token = core.getInput('github-token') || process.env['GITHUB_TOKEN'] || '';
  const title = core.getInput('comment-title') || 'Test Results';
  const resultsPath = core.getInput('test-results');
  const coveragePath = core.getInput('test-coverage');
  const minCoverage = Number(core.getInput('min-coverage'));
  const postNewComment = core.getBooleanInput('post-new-comment');

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
  core.setOutput('coverage-method', coverage.methodCoverage);
};

export const setActionStatus = (testsPassed: boolean, coveragePassed: boolean): void => {
  if (!testsPassed) {
    core.setFailed('Tests Failed');
  }

  if (!coveragePassed) {
    core.setFailed('Coverage Failed');
  }
};
