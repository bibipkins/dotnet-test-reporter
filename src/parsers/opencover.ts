import { CoverageParser, ICoverageData, ICoverageFile, ICoverageModule, ChangedFileWithLineNumbers } from '../data';
import { calculateCoverage, createCoverageModule, parseCoverage } from './common';

const parseOpencover: CoverageParser = async (filePath: string, threshold: number, changedFilesAndLineNumbers: ChangedFileWithLineNumbers[]) =>
  parseCoverage(filePath, threshold, changedFilesAndLineNumbers, parseSummary, parseModules);

const parseSummary = (file: any, modules: ICoverageModule[]): ICoverageData => {
  const summary = file.CoverageSession.Summary[0]['$'];
  const totalCoverage = calculateCoverage(
    Number(summary.visitedSequencePoints) + Number(summary.visitedBranchPoints),
    Number(summary.numSequencePoints) + Number(summary.numBranchPoints)
  );
  const changedLinesTotal = Number(modules.reduce((summ, m) => summ + Number(m.files.reduce((summ2, f) => summ2 + Number(f.changedLinesTotal), 0)), 0))
  const changedLinesCovered = Number(modules.reduce((summ, m) => summ + Number(m.files.reduce((summ2, f) => summ2 + Number(f.changedLinesCovered), 0)), 0))

  return {
    totalCoverage,
    changedLinesTotal,
    changedLinesCovered,
    changedLineCoverage: calculateCoverage(changedLinesCovered, changedLinesTotal),
    linesTotal: Number(summary.numSequencePoints),
    linesCovered: Number(summary.visitedSequencePoints),
    lineCoverage: calculateCoverage(summary.visitedSequencePoints, summary.numSequencePoints),
    branchesTotal: Number(summary.numBranchPoints),
    branchesCovered: Number(summary.visitedBranchPoints),
    branchCoverage: calculateCoverage(summary.visitedBranchPoints, summary.numBranchPoints)
  };
};

const parseModules = (file: any, threshold: number, changedFilesAndLineNumbers: ChangedFileWithLineNumbers[]): ICoverageModule[] => {
  const modules = (file.CoverageSession.Modules[0].Module ?? []) as any[];

  return modules.map(module => {
    const name = String(module.ModuleName[0]);
    const files = parseFiles(name, module);
    const classes = (module.Classes[0].Class ?? []) as any[];
    let moduleComplexity = Number(0);

    classes.forEach(c => {
      const methods = (c.Methods[0].Method ?? []) as any[];
      let complexity = Number(0);

      methods.forEach(m => {
        const file = files.find(f => f.id === m.FileRef[0]['$'].uid);
        const summary = m.Summary[0]['$'];
        const lines = (m.SequencePoints[0].SequencePoint ?? []) as any[];
        const coverableLines = lines.map(line => Number(line['$'].sl));
        complexity = complexity + Number(summary.maxCyclomaticComplexity);

        if (file) {
          const changedFile = changedFilesAndLineNumbers.find(f => (f.name === file.name) || (f.name === file.fullPath));
          const changedLineNumbers = changedFile?.lineNumbers.filter(ln => coverableLines.includes(Number(ln))) || [];
          const changedLines = lines.filter(l => changedLineNumbers.includes(Number(l['$'].sl)));
          file.linesTotal += Number(summary.numSequencePoints);
          file.linesCovered += Number(summary.visitedSequencePoints);
          file.branchesTotal += Number(summary.numBranchPoints);
          file.branchesCovered += Number(summary.visitedBranchPoints);
          file.linesToCover = file.linesToCover.concat(
            lines.filter(line => !Number(line['$'].vc)).map(line => Number(line['$'].sl))
          );
          const unCoveredChangedLines = changedLines.filter(line => !Number(line['$'].vs)).map(line => Number(line['$'].sl));
          file.changedLinesTotal += changedLines.length || 0;
          file.changedLinesCovered += changedLines.length - unCoveredChangedLines.length;
          file.changedLineCoverage = calculateCoverage(file.changedLinesCovered, file.changedLinesTotal);
          file.complexity = complexity;
        }
      });
      moduleComplexity = complexity + moduleComplexity;
    });
    return createCoverageModule(name, threshold, files, moduleComplexity);
  });
};

const parseFiles = (moduleName: string, module: any) => {
  const fileData = (module.Files[0].File ?? []) as any[];

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
    linesToCover: Array<number>(),
    complexity: 0
  } as ICoverageFile));
};

export default parseOpencover;
