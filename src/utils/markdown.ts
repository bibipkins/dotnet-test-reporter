import { ITestCoverage, ITestResult } from '../data';

export const formatHeader = (header: string): string => `## ${header}\n`;

export const formatSubHeader = (header: string): string => `### ${header}\n`;

export const formatFooter = (commit: string) => `<br/>:pencil2: updated for commit ${commit.substring(0, 8)}`;

export const formatTestResults = (results: ITestResult): string => {
  const status = formatResultsStatus(results);
  const summary = formatResultsSummary(results);

  return status + summary;
};

export const formatTestCoverage = (coverage: ITestCoverage, min: number): string => {
  const status = fromatCoverageStatus(coverage, min);
  const summary = formatCoverageSummary(coverage);
  const footer = min ? `_minimum coverage needed: ${min}%_\n\n` : '';

  return status + summary + footer;
};

const formatResultsStatus = (results: ITestResult): string => {
  const successStatus = ':green_circle: &nbsp;Tests Passed';
  const failStatus = ':red_circle: &nbsp;Tests Failed';
  const status = results.success ? successStatus : failStatus;
  const delimiter = ' &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; ';
  const time = `:stopwatch: ${formatElapsedTime(results.elapsed)}`;

  return formatSubHeader(status + delimiter + time);
};

const formatResultsSummary = (results: ITestResult): string => {
  const { total, passed, failed, skipped } = results;

  return formatTable(
    [':memo: Total', ':heavy_check_mark: Passed', ':x: Failed', ':warning: Skipped'],
    [total, passed, failed, skipped]
  );
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

const fromatCoverageStatus = (coverage: ITestCoverage, min: number): string => {
  const successStatus = ':green_circle: &nbsp;Coverage Passed';
  const failStatus = ':red_circle: &nbsp;Coverage Failed';
  const status = coverage.success ? successStatus : failStatus;

  return formatSubHeader(min ? status : 'Coverage');
};

const formatCoverageSummary = (coverage: ITestCoverage): string => {
  const { linesTotal, linesCovered, lineCoverage, branchCoverage, methodCoverage } = coverage;

  return formatTable(
    [':memo: Total', ':straight_ruler: Line&nbsp;&nbsp;&nbsp;', ':herb: Branch', ':wrench: Method'],
    [`${linesCovered} / ${linesTotal}`, `${lineCoverage}%`, `${branchCoverage}%`, `${methodCoverage}%`]
  );
};

const formatTable = (columns: string[], ...data: (string | number)[][]): string => {
  const tableHeader = formatColumns(columns);
  const tableBody = data.map(row => formatColumns(row)).join('\n');
  const delimiter = formatColumns(columns.map(() => '---'));

  return `${tableHeader}\n${delimiter}\n${tableBody}\n\n`;
};

const formatColumns = (columns: (string | number)[]): string => columns.join(' | ');
