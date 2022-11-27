import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getActionInputs, formatTestResults, formatTestCoverage, publishComment, setActionFailed } from './utils';

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, coverageThreshold, postNewComment, configs } = getActionInputs();

    console.log(configs);

    const testResults = await processTestResults(resultsPath);
    let body = formatTestResults(testResults);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, coverageThreshold);
      body += testCoverage ? formatTestCoverage(testCoverage, coverageThreshold) : '';
    }

    await publishComment(token, title, body, postNewComment);
  } catch (error) {
    setActionFailed((error as Error).message);
  }
};

run();
