import { IResult, IResultParser } from '../data';
import { readXmlFile } from '../utils';

export default class TrxParser implements IResultParser {
  public async parse(filePath: string): Promise<IResult | null> {
    const file = await readXmlFile(filePath);

    if (!file) {
      return null;
    }

    const { start, finish } = this.parseElapsedTime(file);
    const { outcome, total, passed, failed, executed } = this.parseSummary(file);
    this.parseResults(file);

    const elapsed = finish.getTime() - start.getTime();
    const skipped = total - executed;
    const success = failed === 0 && outcome === 'Completed';

    return { success, elapsed, total, passed, failed, skipped };
  }

  private parseElapsedTime(file: any) {
    const data = file.TestRun.Times[0]['$'];

    const start = new Date(data.start);
    const finish = new Date(data.finish);

    return { start, finish };
  }

  private parseSummary(file: any) {
    const summary = file.TestRun.ResultSummary[0];
    const data = summary['$'];
    const counters = summary.Counters[0]['$'];

    const total = Number(counters.total);
    const passed = Number(counters.passed);
    const failed = Number(counters.failed);
    const executed = Number(counters.executed);

    return { outcome: data.outcome, total, passed, failed, executed };
  }

  private parseResults(file: any) {
    const results = file.TestRun.Results[0].UnitTestResult;

    for (const result of results) {
      console.log(result['$']);
    }
  }
}
