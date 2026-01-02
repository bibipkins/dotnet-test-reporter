import { CoverageParser, ICoverageData, ICoverageFile, ICoverageModule, ChangedFile } from '../data';
import { CoberturaClass, CoberturaFile } from '../data/cobertura';
import {
  calculateCoverage,
  calculateChangedLineTotals,
  calculateChangedLinesCovered,
  createCoverageModule,
  parseCoverage
} from './common';

const parseCobertura: CoverageParser = (filePath: string, threshold: number, changedFiles: ChangedFile[]) => {
  return parseCoverage(filePath, threshold, changedFiles, parseSummary, parseModules);
};

const parseSummary = (file: CoberturaFile, modules: ICoverageModule[]): ICoverageData => {
  const summary = file.coverage['$'];
  const linesCovered = Number(summary['lines-covered']);
  const linesTotal = Number(summary['lines-valid']);
  const branchesCovered = Number(summary['branches-covered']);
  const branchesTotal = Number(summary['branches-valid']);
  const totalCoverage = calculateCoverage(linesCovered + branchesCovered, linesTotal + branchesTotal);
  const changedLinesTotal = calculateChangedLineTotals(modules);
  const changedLinesCovered = calculateChangedLinesCovered(modules);

  return {
    totalCoverage,
    changedLinesTotal,
    changedLinesCovered,
    changedLineCoverage: calculateCoverage(changedLinesCovered, changedLinesTotal),
    linesTotal,
    linesCovered,
    lineCoverage: calculateCoverage(linesCovered, linesTotal),
    branchesTotal,
    branchesCovered,
    branchCoverage: calculateCoverage(branchesCovered, branchesTotal)
  };
};

const parseModules = (
  file: CoberturaFile,
  threshold: number,
  changedFiles: ChangedFile[]
): ICoverageModule[] => {
  const fileFullDirPath = file.coverage.sources?.[0].source ?? '';
  const modules = file.coverage.packages[0].package ?? [];

  return modules.map(module => {
    const name = String(module['$'].name);
    const classes = module.classes[0].class ?? [];
    const files = parseFiles(classes, fileFullDirPath);
    const complexity = Number(module['$'].complexity);

    classes.forEach(c => {
      const file = files.find(f => f.name === String(c['$'].filename));
      const lines = c.lines[0].line ?? [];
      const branchRegex = /\(([^)]+)\)/;
      const branchData = lines
        .filter(l => l['$']['condition-coverage'])
        .map(l => branchRegex.exec(String(l['$']['condition-coverage']))?.[1].split('/') ?? []);

      const coverableLines = lines.map(line => Number(line['$'].number));

      if (file) {
        const changedFile = changedFiles.find(f => f.name === file.name || f.name === file.fullPath);
        const changedLineNumbers =
          changedFile?.lineNumbers.filter(ln => coverableLines.includes(Number(ln))) || [];
        const changedLines = lines.filter(l => changedLineNumbers.includes(Number(l['$'].number)));
        file.linesTotal += Number(lines.length);
        file.linesCovered += Number(lines.filter(l => Number(l['$'].hits) > 0).length);
        file.branchesTotal += branchData.reduce((summ, branch) => summ + Number(branch[1]), 0);
        file.branchesCovered += branchData.reduce((summ, branch) => summ + Number(branch[0]), 0);
        file.linesToCover = file.linesToCover.concat(
          lines.filter(line => !Number(line['$'].hits)).map(line => Number(line['$'].number))
        );
        const unCoveredChangedLines =
          changedLines?.filter(line => !Number(line['$'].hits)).map(line => Number(line['$'].number)) || [];
        file.changedLinesTotal += changedLines.length;
        file.changedLinesCovered += changedLines.length - unCoveredChangedLines.length;
        file.complexity = Number(c['$'].complexity);
      }
    });

    return createCoverageModule(name, threshold, files, complexity);
  });
};

const parseFiles = (classes: CoberturaClass[], fileDirPath: string): ICoverageFile[] => {
  const fileNames = [...new Set(classes.map(c => String(c['$'].filename)))];

  return fileNames.map(file => ({
    id: file,
    name: file,
    fullPath: fileDirPath + file,
    totalCoverage: 0,
    changedLinesTotal: 0,
    changedLinesCovered: 0,
    changedLineCoverage: 0,
    linesTotal: 0,
    linesCovered: 0,
    lineCoverage: 0,
    branchesTotal: 0,
    branchesCovered: 0,
    branchCoverage: 0,
    linesToCover: Array<number>(),
    complexity: 0
  }));
};

export default parseCobertura;
