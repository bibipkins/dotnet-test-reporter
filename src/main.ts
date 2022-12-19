import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getInputs, publishComment, setFailed, setSummary } from './utils';
import { formatCoverageMarkdown, formatResultMarkdown } from './formatting/markdown';
import { formatResultHtml, formatTitleHtml } from './formatting/html';

const run = async (): Promise<void> => {
  try {
    const { token, title, resultsPath, coveragePath, coverageType, coverageThreshold, postNewComment } = getInputs();

    let comment = '';
    let summary = formatTitleHtml(title);

    const testResult = await processTestResults(resultsPath);
    comment += formatResultMarkdown(testResult);
    summary += formatResultHtml(testResult);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, coverageType, coverageThreshold);
      comment += testCoverage ? formatCoverageMarkdown(testCoverage, coverageThreshold) : '';
    }

    await setSummary(summary);
    await publishComment(token, title, comment, postNewComment);
  } catch (error) {
    setFailed((error as Error).message);
  }
};

run();
