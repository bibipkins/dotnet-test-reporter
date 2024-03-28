import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getInputs, publishComment, setFailed, setSummary, log } from './utils';
import { formatCoverageMarkdown, formatResultMarkdown } from './formatting/markdown';
import { formatCoverageHtml, formatResultHtml, formatTitleHtml } from './formatting/html';
import { DefaultArtifactClient } from '@actions/artifact'
import { writeFileSync } from 'fs';

const run = async (): Promise<void> => {
  try {
    const {
      token,
      title,
      resultsPath,
      coveragePath,
      coverageType,
      coverageThreshold,
      postNewComment,
      allowFailedTests,
      showFailedTestsOnly,
      showTestOutput
    } = getInputs();

    let comment = '';
    let summary = formatTitleHtml(title);

    const testResult = await processTestResults(resultsPath, allowFailedTests);
    comment += formatResultMarkdown(testResult);
    summary += formatResultHtml(testResult, showFailedTestsOnly, showTestOutput);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, coverageType, coverageThreshold);
      comment += testCoverage ? formatCoverageMarkdown(testCoverage, coverageThreshold) : '';
      summary += testCoverage ? formatCoverageHtml(testCoverage) : '';
    }

    await publishComment(token, title, comment, postNewComment);
    const summaryBytes = new Blob([summary]).size;
    const summaryKb = summaryBytes / 1024;

    if ( summaryKb > 1024 ) {
      log(`The summary exceeds the 1024K limit of the step summary and will upload the results as testResults.md`);
      writeFileSync("testResults.md", summary);
      let artifactClient = new DefaultArtifactClient();
      artifactClient.uploadArtifact("testResults",
                                    ["testResults.md"],
                                    '.',
                                    { retentionDays: 2 });
    }
    else {
      await setSummary(summary);
    }

  } catch (error) {
    setFailed((error as Error).message);
  }
};

run();
