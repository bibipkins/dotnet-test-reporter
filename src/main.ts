import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import {
  getInputs,
  formatSummaryTitle,
  formatResult,
  formatResultSummary,
  formatCoverage,
  publishComment,
  setFailed,
  setSummary
} from './utils';

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, coverageType, coverageThreshold, postNewComment } = getInputs();

    let comment = '';
    let summary = formatSummaryTitle(title);

    const testResult = await processTestResults(resultsPath);
    console.log(testResult);
    comment += formatResult(testResult);
    summary += formatResultSummary(testResult);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, coverageType, coverageThreshold);
      comment += testCoverage ? formatCoverage(testCoverage, coverageThreshold) : '';
    }

    await setSummary(summary);
    await publishComment(token, title, comment, postNewComment);
  } catch (error) {
    setFailed((error as Error).message);
  }
};

run();
