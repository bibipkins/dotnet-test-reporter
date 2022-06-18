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

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token') || process.env['GITHUB_TOKEN'] || '';
    const title = core.getInput('comment-title') || 'Test Results';
    const resultsPath = core.getInput('test-results');
    const coverageFilePath = core.getInput('test-coverage');

    const resultsFilePaths = getTestResultPaths(resultsPath);
    const results = await Promise.all(resultsFilePaths.map(path => parseTestResultsFile(path)));
    const aggregatedResults = aggregateTestResults(results);

    let body = formatTestResults(aggregatedResults);

    if (coverageFilePath) {
      const coverageResult = await parseTestCoverageFile(coverageFilePath);
      body += formatTestCoverage(coverageResult);
    }

    await publishComment(token, title, body);

    if (aggregatedResults.failed !== 0) {
      core.setFailed(`${aggregatedResults.failed} Tests Failed`);
    }
  } catch (error: any) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
