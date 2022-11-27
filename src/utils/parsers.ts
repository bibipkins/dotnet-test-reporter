import { readXmlFile } from './files';
import { IResult } from '../data';

export const parseTestResults = async (filePath: string): Promise<IResult | null> => {
  const file = await readXmlFile(filePath);

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

const parseNodeData = (node: any) => node['$'];
