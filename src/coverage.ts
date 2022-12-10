import { CoverageType, ICoverage, ICoverageParser } from './data';
import { setFailed, setCoverageOutputs } from './utils';
import CoberturaParser from './parsers/CoberturaParser';
import OpencoverParser from './parsers/OpencoverParser';

const parsers: { [K in CoverageType]: ICoverageParser } = {
  opencover: new OpencoverParser(),
  cobertura: new CoberturaParser()
};

export const processTestCoverage = async (
  coveragePath: string,
  coverageType: CoverageType,
  coverageThreshold: number
): Promise<ICoverage | null> => {
  const coverage = await parsers[coverageType].parse(coveragePath, coverageThreshold);

  if (!coverage) {
    console.log(`Failed parsing ${coveragePath}`);
    return null;
  }

  console.log(`Processed ${coveragePath}`);
  setCoverageOutputs(coverage);

  if (!coverage.success) {
    setFailed('Coverage Failed');
  }

  return coverage;
};
