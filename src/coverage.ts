import { ITestCoverage } from './data';
import { parseTestCoverage, setCoverageOutputs } from './utils';

export const processTestCoverage = async (coveragePath: string, minCoverage: number): Promise<ITestCoverage | null> => {
  const testCoverage = await parseTestCoverage(coveragePath, minCoverage);

  if (!testCoverage) {
    console.log(`Failed parsing ${coveragePath}`);
  } else {
    console.log(`Processed ${coveragePath}`);
    setCoverageOutputs(testCoverage);
  }

  return testCoverage;
};
