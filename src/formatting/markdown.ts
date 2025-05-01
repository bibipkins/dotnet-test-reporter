import { ICoverage, ICoverageFile, IResult } from '../data';
import { formatElapsedTime, getSectionLink, getStatusIcon } from './common';

export const formatHeaderMarkdown = (header: string): string => `## ${header}\n`;

export const formatFooterMarkdown = (commit: string): string =>
  `<br/>_✏️ updated for commit ${commit.substring(0, 7)}_`;

export const formatSummaryLinkMarkdown = (server_url: string, owner: string, repo: string, runId: number, title: string): string => {
  const url = `${server_url}/${owner}/${repo}/actions/runs/${runId}#user-content-${getSectionLink(title)}`;
  return `🔍 click [here](${url}) for more details\n`;
};

export const formatResultMarkdown = (result: IResult): string => {
  const { total, passed, failed, skipped, success } = result;

  const title = `${getStatusIcon(success)} Tests`;
  const details = failed || skipped ? ` (${failed} failed, ${skipped} skipped)` : '';
  const info = `**${passed} / ${total}**${details}`;
  const status = `- ${getStatusText(success)} in ${formatElapsedTime(result.elapsed)}`;

  return `${title} ${info} ${status}\n`;
};

export const formatCoverageMarkdown = (coverage: ICoverage, min: number): string => {
  const { totalCoverage, linesCovered, linesTotal, branchesTotal, branchesCovered, success } = coverage;

  const title = `${min ? getStatusIcon(success) : '📝'} Coverage`;
  const info = `**${totalCoverage}%**`;
  const status = min ? `- ${getStatusText(success)} with ${min}% threshold` : '';

  const lines = `📏 ${linesCovered} / ${linesTotal} lines covered`;
  const branches = `🌿 ${branchesCovered} / ${branchesTotal} branches covered`;

  return `${title} ${info} ${status}\n${lines} ${branches}\n`;
};

export const formatChangedFileCoverageMarkdown = (files: ICoverageFile[]): string => {
  let table = '| Filename | Complexity | Lines Covered | Changed Lines Covered |\n'
  table += '|----------|------------|---------------|-----------------------|\n'
  for (let file of files ) {
    const { name, complexity, changedLineCoverage, changedLinesTotal, changedLinesCovered, linesCovered, linesTotal, lineCoverage } = file;
    table += `| ${name} | ${complexity} | ${linesCovered} / ${linesTotal} (${lineCoverage}%) | ${changedLinesCovered} / ${changedLinesTotal} (${changedLineCoverage}%) |\n`;
  }

  return `<details>\n<summary>Results</summary>\n\n${table}\n\n</details>\n\n`;
}

const getStatusText = (success: boolean) => (success ? '**passed**' : '**failed**');
