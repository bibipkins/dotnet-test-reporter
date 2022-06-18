import * as core from '@actions/core';
import { ITestResult } from './data';
import {
  getTestResultPaths,
  parseTestResultsFile,
  parseTestCoverageFile,
  formatTestResults,
  formatTestCoverage,
  publishComment
} from './utils';

const aggregateTestResults = (results: ITestResult[]): ITestResult => {
  const aggregatedResults: ITestResult = {
    elapsed: 0,
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  };

  for (const result of results) {
    aggregatedResults.elapsed += result.elapsed;
    aggregatedResults.total += result.total;
    aggregatedResults.passed += result.passed;
    aggregatedResults.failed += result.failed;
    aggregatedResults.skipped += result.skipped;
  }

  return aggregatedResults;
};

const setActionStatus = (testsPassed: boolean, coveragePassed: boolean): void => {
  if (!testsPassed) {
    core.setFailed('Tests Failed');
  }

  if (!coveragePassed) {
    core.setFailed('Coverage Failed');
  }
};

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token') || process.env['GITHUB_TOKEN'] || '';
    const title = core.getInput('comment-title') || 'Test Results';
    const resultsPath = core.getInput('test-results');
    const coveragePath = core.getInput('test-coverage');
    const minCoverage = Number(core.getInput('min-coverage'));

    const resultsFilePaths = getTestResultPaths(resultsPath);
    const results = await Promise.all(resultsFilePaths.map(path => parseTestResultsFile(path)));
    const aggregatedResults = aggregateTestResults(results);

    let testsPassed = !aggregatedResults.failed;
    let coveragePassed = true;
    let body = formatTestResults(aggregatedResults);

    if (coveragePath) {
      const coverageResult = await parseTestCoverageFile(coveragePath);
      coveragePassed = minCoverage ? coverageResult.lineCoverage >= minCoverage : true;
      body += formatTestCoverage(coverageResult, minCoverage);
    }

    await publishComment(token, title, body);
    setActionStatus(testsPassed, coveragePassed);
  } catch (error: any) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
