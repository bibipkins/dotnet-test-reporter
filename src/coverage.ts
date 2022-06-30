import { ITestCoverage } from './data';
import { parseTestCoverage, setActionFailed, setCoverageOutputs } from './utils';

export const processTestCoverage = async (coveragePath: string, minCoverage: number): Promise<ITestCoverage | null> => {
  const testCoverage = await parseTestCoverage(coveragePath, minCoverage);

  if (!testCoverage) {
    console.log(`Failed parsing ${coveragePath}`);
    return null;
  }

  console.log(`Processed ${coveragePath}`);
  setCoverageOutputs(testCoverage);

  if (!testCoverage.success) {
    setActionFailed('Coverage Failed');
  }

  return testCoverage;
};
