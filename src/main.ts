import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import {
  getActionInputs,
  formatTestResult,
  formatTestCoverage,
  publishComment,
  setActionFailed,
  setSummary
} from './utils';

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, coverageType, coverageThreshold, postNewComment } =
      getActionInputs();

    const testResults = await processTestResults(resultsPath);
    let body = formatTestResult(testResults);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, coverageType, coverageThreshold);
      body += testCoverage ? formatTestCoverage(testCoverage, coverageThreshold) : '';
    }

    await publishComment(token, title, body, postNewComment);
    setSummary(title, testResults);
  } catch (error) {
    setActionFailed((error as Error).message);
  }
};

run();
