import xml2js from 'xml2js';
import fs from 'fs';

export const parseTestResultsFile = async (path: string) => {
  const parser = new xml2js.Parser();
  const file = fs.readFileSync(path);
  const content = await parser.parseStringPromise(file);

  const elapsed = parseElapsedTime(content);
  const summary = parseSummary(content);

  return { elapsed, ...summary };
};

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
  console.dir(summary, { depth: 8 });
  const data = readNodeData(summary);
  const counters = readNodeData(summary.Counters[0]);
  const total = counters.total;
  const passed = counters.passed;
  const skipped = total - counters.executed;
  const failed = counters.failed;

  return { outcome: data.outcome, total, passed, failed, skipped };
};

const readNodeData = (node: any) => node['$'];
