import { CoverageType, CoverageParser, ICoverage, ChangedFile } from './data';
import { glob } from 'glob';
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
  coverageThreshold: number,
  changedFiles: ChangedFile[]
): Promise<ICoverage | null> => {
  const filePaths = await glob(coveragePath, { nodir: true });

  if (!filePaths.length) {
    log(`No coverage results found by ${coveragePath}`);
    return null;
  }

  const path = filePaths[0];
  log(`Processing ${path}...`);

  const coverage = await parsers[coverageType](path, coverageThreshold, changedFiles);

  if (!coverage) {
    log(`Failed parsing ${path}`);
    return null;
  }

  log(`Successfully processed ${path}`);
  setCoverageOutputs(coverage);

  if (!coverage.success) {
    setFailed('Coverage Failed');
  }

  return coverage;
};
