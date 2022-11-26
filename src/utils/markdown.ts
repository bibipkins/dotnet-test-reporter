import { ITestCoverage, ITestResult } from '../data';

export const formatHeader = (header: string): string => `## ${header}\n`;

export const formatSubHeader = (header: string): string => `### ${header}\n`;

export const formatFooter = (commit: string) => `<br/>_✏️ updated for commit ${commit.substring(0, 8)}_`;

export const formatTestResults = (results: ITestResult): string => {
  const { total, passed, skipped, success } = results;

  const status = success ? '✔️ Tests Passed' : '❌ Tests Failed';
  const info = `**${passed} / ${total}**${skipped ? ` (${skipped} skipped)` : ''}`;
  const time = `in ⏱️ ${formatElapsedTime(results.elapsed)}`;

  return `${status} ${info} ${time}\n`;
};

export const formatTestCoverage = (coverage: ITestCoverage, min: number): string => {
  const { linesCovered, linesTotal, lineCoverage, success } = coverage;

  const status = min ? (success ? '✔️ Coverage Passed' : '❌ Coverage Failed') : '📝 Coverage';
  const info = `**${lineCoverage}%**${min ? ` (threshold - ${min}%)` : ''}`;
  const details = `📏 **${linesCovered} / ${linesTotal}** lines covered`;

  return `${status} ${info}\n${details}\n`;
};

const formatElapsedTime = (elapsed: number): string => {
  const secondsDelimiter = 1000;
  const minutesDelimiter = 120000;

  if (elapsed >= minutesDelimiter) {
    return `${Math.round(elapsed / 6000) / 10}min`;
  } else if (elapsed >= secondsDelimiter) {
    return `${Math.round(elapsed / 100) / 10}s`;
  } else {
    return `${elapsed}ms`;
  }
};
