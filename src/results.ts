import { ITestResult } from './data';
import { findFiles, parseTestResults, setResultsOutputs } from './utils';

export const processTestResults = async (resultsPath: string): Promise<ITestResult> => {
  const aggregatedResult = getDefaultTestResult();
  const filePaths = findFiles(resultsPath, '.trx');

  if (!filePaths.length) {
    throw Error(`No test results found in ${resultsPath}`);
  }

  for (const path of filePaths) {
    const result = await parseTestResults(path);

    if (!result) {
      throw Error(`Failed parsing ${path}`);
    }

    mergeTestResults(aggregatedResult, result);
  }

  setResultsOutputs(aggregatedResult);

  return aggregatedResult;
};

const mergeTestResults = (result1: ITestResult, result2: ITestResult): void => {
  result1.success = result1.success && result2.success;
  result1.elapsed += result2.elapsed;
  result1.total += result2.total;
  result1.passed += result2.passed;
  result1.failed += result2.failed;
  result1.skipped += result2.skipped;
};

const getDefaultTestResult = (): ITestResult => ({
  success: true,
  elapsed: 0,
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0
});
