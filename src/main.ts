import * as core from '@actions/core';
import { ITestResult } from './data';
import {
  getActionInputs,
  findFiles,
  parseTestResults,
  parseTestCoverage,
  formatTestResults,
  formatTestCoverage,
  setResultsOutputs,
  setCoverageOutputs,
  publishComment,
  setActionStatus
} from './utils';

const aggregateTestResults = (results: ITestResult[]): ITestResult => {
  const aggregatedResults: ITestResult = {
    success: true,
    elapsed: 0,
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  };

  for (const result of results) {
    aggregatedResults.success = aggregatedResults.success && result.success;
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
    const { token, title, resultsPath, coveragePath, minCoverage, postNewComment } = getActionInputs();

    let body = '';
    let testsPassed = true;
    let coveragePassed = true;

    const testResults: ITestResult[] = [];
    const resultsFilePaths = findFiles(resultsPath, '.trx');

    if (resultsFilePaths.length === 0) {
      throw Error(`No test results found in ${resultsPath}`);
    }

    for (const path of resultsFilePaths) {
      const result = await parseTestResults(path);

      if (!result) {
        throw Error(`Failed parsing ${path}`);
      }

      testResults.push(result);
    }

    const aggregatedResults = aggregateTestResults(testResults);
    setResultsOutputs(aggregatedResults);
    testsPassed = aggregatedResults.success;
    body += formatTestResults(aggregatedResults);

    if (coveragePath) {
      const testCoverage = await parseTestCoverage(coveragePath, minCoverage);

      if (!testCoverage) {
        console.error(`Failed parsing ${coveragePath}`);
      } else {
        setCoverageOutputs(testCoverage);
        coveragePassed = testCoverage.success;
        body += formatTestCoverage(testCoverage, minCoverage);
      }
    }

    await publishComment(token, title, body, postNewComment);
    setActionStatus(testsPassed, coveragePassed);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
