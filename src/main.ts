import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getActionInputs, formatTestResult, formatTestCoverage, publishComment, setActionFailed } from './utils';

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
  } catch (error) {
    setActionFailed((error as Error).message);
  }
};

run();
