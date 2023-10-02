import { glob } from 'glob';
import { CoverageType, CoverageParser, ICoverage } from './data';
import { setFailed, setCoverageOutputs, log } from './utils';
import parseOpencover from './parsers/opencover';
import parseCobertura from './parsers/cobertura';

const parsers: { [K in CoverageType]: CoverageParser } = {
  opencover: parseOpencover,
  cobertura: parseCobertura
};

export const processTestCoverage = async (
  coveragePath: string,
  coverageType: CoverageType,
  coverageThreshold: number
): Promise<ICoverage | null> => {
  const filePaths = await glob(coveragePath, { nodir: true });

  if (!filePaths.length) {
    throw Error(`No coverage results found by ${coveragePath}`);
  }

  const filePath = filePaths[0];
  const coverage = await parsers[coverageType](filePath, coverageThreshold);

  if (!coverage) {
    log(`Failed parsing ${filePath}`);
    return null;
  }

  log(`Processed ${filePath}`);
  setCoverageOutputs(coverage);

  if (!coverage.success) {
    setFailed('Coverage Failed');
  }

  return coverage;
};
