import * as core from '@actions/core';
import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getActionInputs, formatTestResults, formatTestCoverage, publishComment, setActionStatus } from './utils';

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, minCoverage, postNewComment } = getActionInputs();
    core.setFailed('Tesing Action Failed');
    let body = '';
    let testsPassed = true;
    let coveragePassed = true;

    const testResults = await processTestResults(resultsPath);
    testsPassed = testResults.success;
    body += formatTestResults(testResults);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, minCoverage);

      if (testCoverage) {
        console.log(`Failed parsing ${coveragePath}`);
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
