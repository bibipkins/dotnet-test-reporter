import { ITestCoverage, ITestResult } from '../data';

export const formatTestResults = (results: ITestResult): string => {
  const status = formatStatus(results);
  const summary = formatResultSummary(results);

  return status + summary;
};

export const formatTestCoverage = (coverage: ITestCoverage, min: number): string => {
  const status = fromatCoverageStatus(coverage, min);
  const summary = formatCoverageSummary(coverage);

  return status + summary;
};

const formatStatus = (results: ITestResult): string => {
  const success = results.failed === 0;
  const status = success ? '### :green_circle: Tests Passed' : '### :red_circle: Tests Failed';
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

const formatResultSummary = (results: ITestResult): string => {
  const { total, passed, failed, skipped } = results;
  const tableHeader = ':memo: Total | :heavy_check_mark: Passed | :x: Failed | :warning: Skipped';
  const tableBody = `${total} | ${passed} | ${failed} | ${skipped}`;

  return `${tableHeader}\n--- | --- | --- | ---\n${tableBody}\n\n`;
};

const fromatCoverageStatus = (coverage: ITestCoverage, min: number): string => {
  const success = coverage.lineCoverage < min;
  const status = success ? '### :green_circle: Coverage Passed' : '### :red_circle: Coverage Failed';
  const hint = ` (minimum coverage: ${min}%)\n`;

  return min ? status + hint : '### Coverage\n';
};

const formatCoverageSummary = (coverage: ITestCoverage): string => {
  const { linesTotal, linesCovered, lineCoverage, branchCoverage, methodCoverage } = coverage;
  const tableHeader = ':memo: Total | Line | Branch | Method';
  const total = `${linesCovered} / ${linesTotal}`;
  const tableBody = `${total} | ${lineCoverage}% | ${branchCoverage}% | ${methodCoverage}%`;

  return `${tableHeader}\n--- | --- | --- | ---\n${tableBody}\n\n`;
};
