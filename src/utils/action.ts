import * as core from '@actions/core';
import { ChangedFileWithLineNumbers, CoverageType, IActionInputs, ICoverage, IResult } from '../data';

const inputs = {
  token: 'github-token',
  title: 'comment-title',
  postNewComment: 'post-new-comment',
  allowFailedTests: 'allow-failed-tests',
  resultsPath: 'results-path',
  coveragePath: 'coverage-path',
  coverageType: 'coverage-type',
  coverageThreshold: 'coverage-threshold',
  changedFilesAndLineNumbers: 'changed-files-and-line-numbers',
  showFailedTestsOnly: 'show-failed-tests-only',
  showTestOutput: 'show-test-output'
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

export const getInputs = (): IActionInputs => {
  const token = core.getInput(inputs.token) || process.env['GITHUB_TOKEN'] || '';

  return {
    token,
    title: core.getInput(inputs.title),
    postNewComment: core.getBooleanInput(inputs.postNewComment),
    allowFailedTests: core.getBooleanInput(inputs.allowFailedTests),
    resultsPath: core.getInput(inputs.resultsPath),
    coveragePath: core.getInput(inputs.coveragePath),
    coverageType: core.getInput(inputs.coverageType) as CoverageType,
    coverageThreshold: Number(core.getInput(inputs.coverageThreshold)),
    changedFilesAndLineNumbers: JSON.parse(core.getInput(inputs.changedFilesAndLineNumbers)) as ChangedFileWithLineNumbers[],
    showFailedTestsOnly: core.getBooleanInput(inputs.showFailedTestsOnly),
    showTestOutput: core.getBooleanInput(inputs.showTestOutput)
  };
};

export const setResultOutputs = (result: IResult): void => {
  core.setOutput(outputs.total, result.total);
  core.setOutput(outputs.passed, result.passed);
  core.setOutput(outputs.failed, result.failed);
  core.setOutput(outputs.skipped, result.skipped);
};

export const setCoverageOutputs = (coverage: ICoverage): void => {
  core.setOutput(outputs.lineCoverage, coverage.lineCoverage);
  core.setOutput(outputs.linesTotal, coverage.linesTotal);
  core.setOutput(outputs.linesCovered, coverage.linesCovered);
  core.setOutput(outputs.branchCoverage, coverage.branchCoverage);
  core.setOutput(outputs.branchesTotal, coverage.branchesTotal);
  core.setOutput(outputs.branchesCovered, coverage.branchesCovered);
};

export const setFailed = (message: string): void => {
  core.setFailed(message);
};

export const setSummary = async (text: string): Promise<void> => {
  await core.summary.addRaw(text).write();
};

export const log = (message: string): void => {
  core.info(message);
};
