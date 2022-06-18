import { ITestCoverage, ITestResult } from '../data';

export const formatTestCoverage = (coverage: ITestCoverage): string => {
  const { linesTotal, linesCovered, lineCoverage, branchCoverage, methodCoverage } = coverage;
  const tableHeader = ':memo: Total Covered | Line | Branch | Method';
  const total = `${linesCovered}/${linesTotal}`;
  const tableBody = `${total} | ${lineCoverage}% | ${branchCoverage}% | ${methodCoverage}%`;

  return `${tableHeader}\n--- | --- | --- | ---\n${tableBody}\n\n`;
};

export const formatTestResults = (results: ITestResult): string => {
  const status = formatStatus(results);
  const summary = formatSummary(results);

  return status + summary;
};

const formatStatus = (results: ITestResult): string => {
  const success = results.failed === 0;
  const status = success ? ':green_circle: **SUCCESS**' : ':red_circle: **FAIL**';
  const delimiter = '&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;';
  const time = `:stopwatch: ${formatElapsedTime(results.elapsed)}\n`;

  return status + delimiter + time;
};

const formatElapsedTime = (elapsed: number): string => {
  const secondsDelimiter = 1000;
  const minutesDelimiter = 120000;

  if (elapsed >= minutesDelimiter) {
    return `${Math.abs(elapsed / minutesDelimiter)}min`;
  } else if (elapsed >= secondsDelimiter) {
    return `${Math.abs(elapsed / secondsDelimiter)}s`;
  } else {
    return `${elapsed}ms`;
  }
};

const formatSummary = (results: ITestResult): string => {
  const { total, passed, failed, skipped } = results;
  const tableHeader = ':memo: Total | :heavy_check_mark: Passed | :x: Failed | :warning: Skipped';
  const tableBody = `${total} | ${passed} | ${failed} | ${skipped}`;

  return `${tableHeader}\n--- | --- | --- | ---\n${tableBody}\n\n`;
};
