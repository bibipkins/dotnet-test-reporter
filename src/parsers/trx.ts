import { ITestSuit, ResultParser, TestOutcome } from '../data';
import { readXmlFile } from '../utils';

const parseTrx: ResultParser = async (filePath: string) => {
  const file = await readXmlFile(filePath);

  if (!file) {
    return null;
  }

  const { start, finish } = parseElapsedTime(file);
  const summary = parseSummary(file);
  const suits = parseSuits(file);

  const elapsed = finish.getTime() - start.getTime();
  const skipped = summary.total - summary.executed;
  const success = summary.failed === 0;

  return { success, ...summary, skipped, elapsed, suits };
};

const parseElapsedTime = (file: any) => {
  const times = file.TestRun.Times[0]['$'];
  const start = new Date(times.start);
  const finish = new Date(times.finish);

  return { start, finish };
};

const parseSummary = (file: any) => {
  const summary = file.TestRun.ResultSummary[0];
  const counters = summary.Counters[0]['$'];

  return {
    outcome: String(summary['$'].outcome),
    total: Number(counters.total),
    passed: Number(counters.passed),
    failed: Number(counters.failed),
    executed: Number(counters.executed)
  };
};

const parseResults = (file: any) => {
  const results = (file.TestRun?.Results?.[0]?.UnitTestResult ?? []) as any[];

  return results.map((result: any) => ({
    executionId: String(result['$'].executionId),
    testId: String(result['$'].testId),
    testName: String(result['$'].testName),
    testType: String(result['$'].testType),
    testListId: String(result['$'].testListId),
    computerName: String(result['$'].computerName),
    duration: String(result['$'].duration),
    startTime: new Date(result['$'].startTime),
    endTime: new Date(result['$'].endTime),
    outcome: String(result['$'].outcome) as TestOutcome,
    output: String(result.Output?.[0]?.StdOut?.[0] ?? ''),
    error: String(result.Output?.[0]?.ErrorInfo?.[0]?.Message?.[0] ?? ''),
    trace: String(result.Output?.[0]?.ErrorInfo?.[0]?.StackTrace?.[0] ?? ''),
    relativeResultsDirectory: String(result['$'].relativeResultsDirectory)
  }));
};

const parseDefinitions = (file: any) => {
  const definitions = (file.TestRun?.TestDefinitions?.[0]?.UnitTest ?? []) as any[];

  return definitions.map(definition => ({
    id: String(definition['$'].id),
    name: String(definition['$'].name),
    storage: String(definition['$'].storage),
    description: String(definition.Description?.[0]),
    executionId: String(definition.Execution[0]['$'].id),
    testMethod: {
      codeBase: String(definition.TestMethod[0]['$'].codeBase),
      adapterTypeName: String(definition.TestMethod[0]['$'].adapterTypeName),
      className: String(definition.TestMethod[0]['$'].className),
      name: String(definition.TestMethod[0]['$'].name)
    }
  }));
};

const parseSuits = (file: any) => {
  const suits: ITestSuit[] = [];
  const results = parseResults(file);
  const definitions = parseDefinitions(file);
  const sortedDefinitions = definitions.sort((a, b) => a.name.localeCompare(b.name));

  for (const definition of sortedDefinitions) {
    const result = results.find(r => r.testId === definition.id);
    const existingSuit = suits.find(s => s.name === definition.testMethod.className);
    const suit = existingSuit || {
      name: definition.testMethod.className,
      success: false,
      passed: 0,
      tests: []
    };

    suit.tests.push({
      name: definition.name.replace(`${definition.testMethod.className}.`, ''),
      output: result?.output ?? '',
      error: result?.error ?? '',
      trace: result?.trace ?? '',
      outcome: result?.outcome || 'NotExecuted'
    });

    if (!existingSuit) {
      suits.push(suit);
    }
  }

  suits.forEach(suit => {
    suit.success = suit.tests.every(test => test.outcome !== 'Failed');
    suit.passed = suit.tests.filter(test => test.outcome === 'Passed').length;
  });

  return suits;
};

export default parseTrx;
