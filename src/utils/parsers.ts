import { readFile } from './files';
import { ITestCoverage, ITestResult } from '../data';

export const parseTestResults = async (filePath: string): Promise<ITestResult | null> => {
  const file = await readFile(filePath);

  if (!file) {
    return null;
  }

  const { start, finish } = parseElapsedTime(file);
  const { outcome, total, passed, failed, executed } = parseResultsSummary(file);

  const elapsed = finish.getTime() - start.getTime();
  const skipped = total - executed;
  const success = failed === 0 && outcome === 'Completed';

  return { success, elapsed, total, passed, failed, skipped };
};

export const parseTestCoverage = async (filePath: string, min: number): Promise<ITestCoverage | null> => {
  const file = await readFile(filePath);

  if (!file) {
    return null;
  }

  const summary = parseCoverageSummary(file);
  const success = !min || summary.lineCoverage >= min;

  return { success, ...summary };
};

const parseElapsedTime = (file: any) => {
  const times = file.TestRun?.Times;
  const data = parseNodeData(times[0]);

  const start = new Date(data.start);
  const finish = new Date(data.finish);

  return { start, finish };
};

const parseResultsSummary = (file: any) => {
  const summary = file.TestRun.ResultSummary[0];
  const data = parseNodeData(summary);
  const counters = parseNodeData(summary.Counters[0]);

  const total = Number(counters.total);
  const passed = Number(counters.passed);
  const failed = Number(counters.failed);
  const executed = Number(counters.executed);

  return { outcome: data.outcome, total, passed, failed, executed };
};

const parseCoverageSummary = (file: any) => {
  const summary = file.CoverageSession?.Summary[0];
  const data = parseNodeData(summary);

  const linesTotal = data.numSequencePoints;
  const linesCovered = data.visitedSequencePoints;
  const lineCoverage = data.sequenceCoverage;

  const branchesTotal = data.numBranchPoints;
  const branchesCovered = data.visitedBranchPoints;
  const branchCoverage = data.branchCoverage;

  return { linesTotal, linesCovered, lineCoverage, branchesTotal, branchesCovered, branchCoverage };
};

const parseNodeData = (node: any) => node['$'];
