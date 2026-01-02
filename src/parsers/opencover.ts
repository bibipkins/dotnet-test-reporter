import { CoverageParser, ICoverageData, ICoverageFile, ICoverageModule, ChangedFile } from '../data';
import { OpencoverFile, OpencoverMethod, OpencoverModule, SequencePoint } from '../data/opencover';
import {
  calculateCoverage,
  calculateChangedLineTotals,
  calculateChangedLinesCovered,
  createCoverageModule,
  parseCoverage
} from './common';

const parseOpencover: CoverageParser = (filePath: string, threshold: number, changedFiles: ChangedFile[]) => {
  return parseCoverage(filePath, threshold, changedFiles, parseSummary, parseModules);
};

const parseSummary = (file: OpencoverFile, modules: ICoverageModule[]): ICoverageData => {
  const summary = file.CoverageSession.Summary[0]['$'];
  const visitedSequencePoints = Number(summary.visitedSequencePoints);
  const visitedBranchPoints = Number(summary.visitedBranchPoints);
  const numberSequencePoints = Number(summary.numSequencePoints);
  const numberBranchPoints = Number(summary.numBranchPoints);
  const totalVisitedPoints = visitedSequencePoints + visitedBranchPoints;
  const totalPoints = numberSequencePoints + numberBranchPoints;
  const changedLinesTotal = calculateChangedLineTotals(modules);
  const changedLinesCovered = calculateChangedLinesCovered(modules);

  return {
    totalCoverage: calculateCoverage(totalVisitedPoints, totalPoints),
    changedLinesTotal,
    changedLinesCovered,
    changedLineCoverage: calculateCoverage(changedLinesCovered, changedLinesTotal),
    linesTotal: numberSequencePoints,
    linesCovered: visitedSequencePoints,
    lineCoverage: calculateCoverage(visitedSequencePoints, numberSequencePoints),
    branchesTotal: numberBranchPoints,
    branchesCovered: visitedBranchPoints,
    branchCoverage: calculateCoverage(visitedBranchPoints, numberBranchPoints)
  };
};

const parseModules = (
  file: OpencoverFile,
  threshold: number,
  changedFiles: ChangedFile[]
): ICoverageModule[] => {
  const modules = file.CoverageSession.Modules[0].Module ?? [];

  return modules.map(module => {
    const name = String(module.ModuleName[0]);
    const files = parseFiles(name, module);
    const classes = module.Classes[0].Class ?? [];
    let moduleComplexity = Number(0);

    classes.forEach(c => {
      const methods = c.Methods[0].Method ?? [];
      let complexity = Number(0);

      methods.forEach(m => {
        const file = files.find(f => f.id === m.FileRef[0]['$'].uid);
        const summary = m.Summary[0]['$'];
        complexity = complexity + Number(summary.maxCyclomaticComplexity);

        if (file) {
          updateFileCoverage(file, m, changedFiles);
          file.complexity = complexity;
        }
      });

      moduleComplexity = complexity + moduleComplexity;
    });

    return createCoverageModule(name, threshold, files, moduleComplexity);
  });
};

const parseFiles = (moduleName: string, module: OpencoverModule): ICoverageFile[] => {
  const fileData = module.Files[0].File ?? [];

  return fileData.map(file => ({
    id: String(file['$'].uid),
    fullPath: String(file['$'].fullPath),
    name: String(file['$'].fullPath).split(`${moduleName}\\`).slice(-1).pop() ?? '',
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
    linesToCover: [],
    complexity: 0
  }));
};

const updateFileCoverage = (file: ICoverageFile, method: OpencoverMethod, changedFiles: ChangedFile[]) => {
  const summary = method.Summary[0]['$'];
  const lines = method.SequencePoints[0].SequencePoint ?? [];
  const coverableLines = getSourceLines(lines);
  const changedFile = changedFiles.find(f => f.name === file.name || f.name === file.fullPath);
  const changedLineNumbers = changedFile?.lineNumbers.filter(ln => coverableLines.includes(Number(ln))) || [];
  const changedLines = lines.filter(l => changedLineNumbers.includes(Number(l['$'].sl)));
  const changedLinesToCover = getSourceLines(changedLines.filter(line => !Number(line['$'].vs)));

  file.linesTotal += Number(summary.numSequencePoints);
  file.linesCovered += Number(summary.visitedSequencePoints);
  file.branchesTotal += Number(summary.numBranchPoints);
  file.branchesCovered += Number(summary.visitedBranchPoints);
  file.linesToCover = file.linesToCover.concat(getSourceLines(lines.filter(line => !Number(line['$'].vc))));
  file.changedLinesTotal += changedLines.length || 0;
  file.changedLinesCovered += changedLines.length - changedLinesToCover.length;
  file.changedLineCoverage = calculateCoverage(file.changedLinesCovered, file.changedLinesTotal);
};

const getSourceLines = (lines: SequencePoint[]): number[] => {
  return lines.map(line => Number(line['$'].sl));
};

export default parseOpencover;
