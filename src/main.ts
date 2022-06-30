import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getActionInputs, formatTestResults, formatTestCoverage, publishComment, setActionFailed } from './utils';

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, minCoverage, postNewComment } = getActionInputs();

    const testResults = await processTestResults(resultsPath);
    let body = formatTestResults(testResults);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, minCoverage);
      body += testCoverage ? formatTestCoverage(testCoverage, minCoverage) : '';
    }

    await publishComment(token, title, body, postNewComment);
  } catch (error) {
    setActionFailed((error as Error).message);
  }
};

run();
