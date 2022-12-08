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
    const results = this.parseResults(file);
    const definitions = this.parseDefinitions(file);

    const tests = definitions.map(definition => {
      const result = results.find(r => r.testId === definition.id);

      return {
        name: result?.testName.replace(definition.testMethod.className, ''),
        suit: definition.testMethod.className,
        outcome: result?.outcome || ''
      };
    });

    const elapsed = finish.getTime() - start.getTime();
    const skipped = total - executed;
    const success = failed === 0 && outcome === 'Completed';

    return { success, elapsed, total, passed, failed, skipped, tests };
  }

  private parseElapsedTime(file: any) {
    const times = file.TestRun.Times[0]['$'];

    const start = new Date(times.start);
    const finish = new Date(times.finish);

    return { start, finish };
  }

  private parseSummary(file: any) {
    const summary = file.TestRun.ResultSummary[0];
    const outcome = summary['$'].outcome;
    const counters = summary.Counters[0]['$'];

    const total = Number(counters.total);
    const passed = Number(counters.passed);
    const failed = Number(counters.failed);
    const executed = Number(counters.executed);

    return { outcome, total, passed, failed, executed };
  }

  private parseResults(file: any) {
    const results = file.TestRun.Results[0].UnitTestResult as any[];

    return results.map((result: any) => ({
      executionId: result['$'].executionId,
      testId: result['$'].testId,
      testName: result['$'].testName,
      testType: result['$'].testType,
      testListId: result['$'].testListId,
      computerName: result['$'].computerName,
      duration: result['$'].duration,
      startTime: result['$'].startTime,
      endTime: result['$'].endTime,
      outcome: result['$'].outcome,
      relativeResultsDirectory: result['$'].relativeResultsDirectory
    }));
  }

  private parseDefinitions(file: any) {
    const definitions = file.TestRun.TestDefinitions[0].UnitTest as any[];

    return definitions.map(definition => ({
      id: definition['$'].id,
      name: definition['$'].name,
      storage: definition['$'].storage,
      description: definition.Description?.[0],
      executionId: definition.Execution[0]['$'].id,
      testMethod: {
        codeBase: definition.TestMethod[0]['$'].codeBase,
        adapterTypeName: definition.TestMethod[0]['$'].adapterTypeName,
        className: definition.TestMethod[0]['$'].className,
        name: definition.TestMethod[0]['$'].name
      }
    }));
  }
}
