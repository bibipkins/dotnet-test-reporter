import * as core from '@actions/core';
import { ITestResult } from './data';
import {
  getActionInputs,
  getTestResultPaths,
  parseTestResultsFile,
  parseTestCoverageFile,
  formatTestResults,
  formatTestCoverage,
  setResultOutputs,
  setCoverageOutputs,
  publishComment,
  setActionStatus
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

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, minCoverage } = getActionInputs();

    const resultsFilePaths = getTestResultPaths(resultsPath);
    const results = await Promise.all(resultsFilePaths.map(path => parseTestResultsFile(path)));
    const aggregatedResults = aggregateTestResults(results);

    let testsPassed = !aggregatedResults.failed;
    let coveragePassed = true;
    let body = formatTestResults(aggregatedResults);
    setResultOutputs(aggregatedResults);

    if (coveragePath) {
      const coverageResult = await parseTestCoverageFile(coveragePath);
      coveragePassed = minCoverage ? coverageResult.lineCoverage >= minCoverage : true;
      body += formatTestCoverage(coverageResult, minCoverage);
      setCoverageOutputs(coverageResult);
    }

    await publishComment(token, title, body);
    setActionStatus(testsPassed, coveragePassed);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
