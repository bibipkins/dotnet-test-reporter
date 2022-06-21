import xml2js from 'xml2js';
import fs from 'fs';
import { ITestCoverage, ITestResult } from '../data';

export const parseTestCoverageFile = async (path: string): Promise<ITestCoverage> => {
  const content = await readFile(path);
  const summary = content.CoverageSession?.Summary[0];
  const data = readNodeData(summary);

  const linesTotal = data.numSequencePoints;
  const linesCovered = data.visitedSequencePoints;
  const methodsTotal = data.numMethods;
  const methodsCovered = data.visitedMethods;
  const lineCoverage = data.sequenceCoverage;
  const branchCoverage = data.branchCoverage;
  const methodCoverage = Math.floor((methodsCovered / methodsTotal) * 10000) / 100;

  return { linesTotal, linesCovered, lineCoverage, branchCoverage, methodCoverage };
};

export const parseTestResultsFile = async (path: string): Promise<ITestResult> => {
  const content = await readFile(path);
  const elapsed = parseElapsedTime(content);
  const summary = parseSummary(content);

  return { elapsed, ...summary };
};

const readFile = (path: string): Promise<any> => {
  const file = fs.readFileSync(path);
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(file);
};

const readNodeData = (node: any) => node['$'];

const parseElapsedTime = (trx: any): number => {
  const times = trx.TestRun?.Times;
  const data = readNodeData(times[0]);
  const start = new Date(data.start);
  const finish = new Date(data.finish);
  const milisconds = finish.getTime() - start.getTime();

  return milisconds;
};

const parseSummary = (trx: any) => {
  const summary = trx.TestRun?.ResultSummary[0];
  const data = readNodeData(summary);
  const counters = readNodeData(summary.Counters[0]);
  const total = Number(counters.total);
  const passed = Number(counters.passed);
  const skipped = total - Number(counters.executed);
  const failed = Number(counters.failed);

  return { outcome: data.outcome, total, passed, failed, skipped };
};
