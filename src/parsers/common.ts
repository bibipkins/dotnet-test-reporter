import { ICoverage, ICoverageData, ICoverageFile, ICoverageModule } from '../data';
import { readXmlFile } from '../utils';

export const calculateCoverage = (covered: number, total: number): number => {
  return total ? Math.round((covered / total) * 10000) / 100 : 100;
};

export const createCoverageModule = (name: string, threshold: number, files: ICoverageFile[], complexity: number=0,): ICoverageModule => {
  const total = files.reduce((summ, file) => summ + file.linesTotal + file.branchesTotal, 0);
  const covered = files.reduce((summ, file) => summ + file.linesCovered + file.branchesCovered, 0);
  const coverage = calculateCoverage(covered, total);
  const success = !threshold || coverage >= threshold;

  const updatedFiles = files
    .map(file => ({
      ...file,
      totalCoverage: calculateCoverage(file.linesCovered + file.branchesCovered, file.linesTotal + file.branchesTotal),
      lineCoverage: calculateCoverage(file.linesCovered, file.linesTotal),
      branchCoverage: calculateCoverage(file.branchesCovered, file.branchesTotal)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { name, coverage, success, files: updatedFiles, complexity };
};

export const parseCoverage = async (
  filePath: string,
  threshold: number,
  parseSummary: (file: any) => ICoverageData,
  parseModules: (file: any, threshold: number) => ICoverageModule[]
): Promise<ICoverage | null> => {
  const file = await readXmlFile(filePath);

  if (!file) {
    return null;
  }

  const summary = parseSummary(file);
  const modules = parseModules(file, threshold);
  const success = !threshold || summary.totalCoverage >= threshold;

  return { success, ...summary, modules };
};
