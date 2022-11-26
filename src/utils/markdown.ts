import { ITestCoverage, ITestResult } from '../data';

export const formatHeader = (header: string): string => `## ${header}\n`;

export const formatSubHeader = (header: string): string => `### ${header}\n`;

export const formatFooter = (commit: string) => `<br/>_✏️ updated for commit ${commit.substring(0, 8)}_`;

export const formatTestResults = (results: ITestResult): string => {
  const { total, passed, skipped, success } = results;

  const title = `${getStatusIcon(success)} Tests`;
  const info = `**${passed} / ${total}**${skipped ? ` (${skipped} skipped)` : ''}`;
  const status = `- ${getStatusText(success)} in ${formatElapsedTime(results.elapsed)}`;

  return `${title} ${info} ${status}\n`;
};

export const formatTestCoverage = (coverage: ITestCoverage, min: number): string => {
  const { linesCovered, linesTotal, lineCoverage, branchesTotal, branchesCovered, success } = coverage;

  const title = `${min ? getStatusIcon(success) : '📝'} Coverage`;
  const info = `**${lineCoverage}%**`;
  const status = min ? `- ${getStatusText(success)} with ${min}% threshold` : '';

  const lines = `📏 ${linesCovered} / ${linesTotal} lines covered`;
  const branches = `🌿 ${branchesCovered} / ${branchesTotal} branches covered`;

  return `${title} ${info} ${status}\n${lines}\n${branches}\n`;
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

const getStatusIcon = (success: boolean) => (success ? '✔️' : '❌');

const getStatusText = (success: boolean) => (success ? '**passed**' : '**failed**');
