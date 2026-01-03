import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getInputs, publishComment, setFailed, setSummary, createTestStatusCheck } from './utils';
import {
  formatChangedFileCoverageMarkdown,
  formatCoverageMarkdown,
  formatResultMarkdown
} from './formatting/markdown';
import { formatCoverageHtml, formatResultHtml, formatTitleHtml } from './formatting/html';
import { ICoverage } from './data';

const publishChangedFileCoverage = async (
  coverage: ICoverage,
  token: string,
  serverUrl: string,
  postNewComment: boolean
) => {
  for (const module of coverage.modules) {
    const changedFiles = module.files.filter(f => f.changedLinesTotal > 0);
    const commentTitle = `${module.name}'s Changed File Coverage`;

    if (changedFiles.length) {
      const message = formatChangedFileCoverageMarkdown(changedFiles);
      await publishComment(token, serverUrl, commentTitle, message, postNewComment);
    }
  }
};

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
      changedFiles,
      showFailedTestsOnly,
      showTestOutput,
      serverUrl,
      pullRequestCheck,
      pullRequestCheckName
    } = getInputs();

    let comment = '';
    let summary = formatTitleHtml(title);

    const testResult = await processTestResults(resultsPath, allowFailedTests);
    const resultHtml = formatResultHtml(testResult, showFailedTestsOnly, showTestOutput);
    comment += formatResultMarkdown(testResult);
    summary += resultHtml;

    if (coveragePath) {
      const testCoverage = await processTestCoverage(
        coveragePath,
        coverageType,
        coverageThreshold,
        changedFiles
      );

      comment += testCoverage ? formatCoverageMarkdown(testCoverage, coverageThreshold) : '';
      summary += testCoverage ? formatCoverageHtml(testCoverage) : '';

      if (testCoverage) {
        await publishChangedFileCoverage(testCoverage, token, serverUrl, postNewComment);
      }
    }

    await setSummary(summary);
    await publishComment(token, serverUrl, title, comment, postNewComment);

    if (pullRequestCheck) {
      await createTestStatusCheck(token, testResult.success, resultHtml, pullRequestCheckName);
    }
  } catch (error) {
    setFailed((error as Error).message);
  }
};

run();
