import { readXmlFile } from '../utils';
import { ICoverage, ICoverageData, ICoverageFile, ICoverageModule, ChangedFile } from '../data';
import { CoberturaFile } from '../data/cobertura';
import { OpencoverFile } from '../data/opencover';

export const calculateCoverage = (covered: number, total: number): number => {
  return total ? Math.round((covered / total) * 10000) / 100 : 100;
};

export const calculateChangedLineTotals = (modules: ICoverageModule[]): number => {
  return Number(modules.reduce((summ, m) => summ + calculateTotal(m, 'changedLinesTotal'), 0));
};

export const calculateChangedLinesCovered = (modules: ICoverageModule[]): number => {
  return Number(modules.reduce((summ, m) => summ + calculateTotal(m, 'changedLinesCovered'), 0));
};

export const createCoverageModule = (
  name: string,
  threshold: number,
  files: ICoverageFile[],
  complexity: number = 0
): ICoverageModule => {
  const total = files.reduce((summ, file) => summ + file.linesTotal + file.branchesTotal, 0);
  const covered = files.reduce((summ, file) => summ + file.linesCovered + file.branchesCovered, 0);
  const coverage = calculateCoverage(covered, total);
  const success = !threshold || coverage >= threshold;

  const updatedFiles = files
    .map(file => ({
      ...file,
      totalCoverage: calculateCoverage(
        file.linesCovered + file.branchesCovered,
        file.linesTotal + file.branchesTotal
      ),
      lineCoverage: calculateCoverage(file.linesCovered, file.linesTotal),
      branchCoverage: calculateCoverage(file.branchesCovered, file.branchesTotal),
      changedLineCoverage: calculateCoverage(file.changedLinesCovered, file.changedLinesTotal)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { name, coverage, success, files: updatedFiles, complexity };
};

export const parseCoverage = async <TFile extends CoberturaFile | OpencoverFile>(
  filePath: string,
  threshold: number,
  changedFiles: ChangedFile[],
  parseSummary: (file: TFile, modules: ICoverageModule[]) => ICoverageData,
  parseModules: (file: TFile, threshold: number, changedFiles: ChangedFile[]) => ICoverageModule[]
): Promise<ICoverage | null> => {
  const file = await readXmlFile<TFile>(filePath);

  if (!file) {
    return null;
  }

  const modules = parseModules(file, threshold, changedFiles);
  const summary = parseSummary(file, modules);
  const success = !threshold || summary.totalCoverage >= threshold;

  return { success, ...summary, modules };
};

const calculateTotal = (module: ICoverageModule, key: keyof ICoverageFile): number => {
  return module.files.reduce((summ, file) => summ + Number(file[key]), 0);
};
