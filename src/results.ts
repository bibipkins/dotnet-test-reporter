import { glob } from 'glob';
import { IResult } from './data';
import { log, setFailed, setResultOutputs } from './utils';
import parseTrx from './parsers/trx';

export const processTestResults = async (resultsPath: string, allowFailedTests: boolean): Promise<IResult> => {
  const aggregatedResult = getDefaultTestResult();
  const filePaths = await glob(resultsPath);
  const trxPaths = filePaths.filter(path => path.endsWith('.trx'));

  if (!trxPaths.length) {
    throw Error(`No test results found by ${resultsPath}`);
  }

  for (const path of trxPaths) {
    await processResult(path, aggregatedResult);
  }

  setResultOutputs(aggregatedResult);

  if (!aggregatedResult.success) {
    allowFailedTests ? log('Tests Failed') : setFailed('Tests Failed');
  }

  return aggregatedResult;
};

const processResult = async (path: string, aggregatedResult: IResult): Promise<void> => {
  const result = await parseTrx(path);

  if (!result) {
    throw Error(`Failed parsing ${path}`);
  }

  log(`Processed ${path}`);
  mergeTestResults(aggregatedResult, result);
};

const mergeTestResults = (result1: IResult, result2: IResult): void => {
  result1.success = result1.success && result2.success;
  result1.elapsed += result2.elapsed;
  result1.total += result2.total;
  result1.passed += result2.passed;
  result1.failed += result2.failed;
  result1.skipped += result2.skipped;
  result1.suits.push(...result2.suits);
};

const getDefaultTestResult = (): IResult => ({
  success: true,
  elapsed: 0,
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  suits: []
});
