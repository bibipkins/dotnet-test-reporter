import * as core from '@actions/core';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { CoverageType, IActionInputs, ICoverage, IResult } from '../data';

const inputs = {
  token: 'github-token',
  title: 'comment-title',
  postNewComment: 'post-new-comment',
  resultsPath: 'results-path',
  coveragePath: 'coverage-path',
  coverageType: 'coverage-type',
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

const outcomeIcons = {
  Passed: '✔️',
  Failed: '❌',
  NotExecuted: '⚠️'
};

export const setActionFailed = (message: string): void => {
  core.setFailed(message);
};

export const getActionInputs = (): IActionInputs => {
  const token = core.getInput(inputs.token) || process.env['GITHUB_TOKEN'] || '';

  return {
    token,
    title: core.getInput(inputs.title),
    postNewComment: core.getBooleanInput(inputs.postNewComment),
    resultsPath: core.getInput(inputs.resultsPath),
    coveragePath: core.getInput(inputs.coveragePath),
    coverageType: core.getInput(inputs.coverageType) as CoverageType,
    coverageThreshold: Number(core.getInput(inputs.coverageThreshold))
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

export const setSummary = async (title: string, result: IResult): Promise<void> => {
  core.summary.addHeading(title).addHeading('Tests', 3);

  const suits = groupBy(sortBy(result.tests, ['className', 'name']), 'className');

  for (const suit in suits) {
    //const icon = suits[suit].every(test => test.outcome !== 'Failed') ? '✔️' : '❌';
    const rows = suits[suit].map(test => `<tr><td>${test.name}</td><td>${outcomeIcons[test.outcome]}</td></tr>`).join();
    const header = '<tr><th>Test</th><th>Result</th></tr>';
    const body = `<tbody>${header}${rows}</tbody>`;
    const table = `<table role="table">${body}</table>`;
    const details = `<details><summary>lol</summary>${table}</details>`;
    core.summary.addRaw(details);
  }

  await core.summary.write();
};
