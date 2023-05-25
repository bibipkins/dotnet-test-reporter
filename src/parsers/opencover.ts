import { CoverageParser, ICoverageData, ICoverageModule } from '../data';
import { calculateCoverage, createCoverageModule, parseCoverage } from './common';

const parseOpencover: CoverageParser = async (filePath: string, threshold: number) =>
  parseCoverage(filePath, threshold, parseSummary, parseModules);

const parseSummary = (file: any): ICoverageData => {
  const summary = file.CoverageSession.Summary[0]['$'];
  const totalCoverage = calculateCoverage(
    Number(summary.visitedSequencePoints) + Number(summary.visitedBranchPoints),
    Number(summary.numSequencePoints) + Number(summary.numBranchPoints)
  );

  return {
    totalCoverage,
    linesTotal: Number(summary.numSequencePoints),
    linesCovered: Number(summary.visitedSequencePoints),
    lineCoverage: calculateCoverage(summary.visitedSequencePoints, summary.numSequencePoints),
    branchesTotal: Number(summary.numBranchPoints),
    branchesCovered: Number(summary.visitedBranchPoints),
    branchCoverage: calculateCoverage(summary.visitedBranchPoints, summary.numBranchPoints)
  };
};

const parseModules = (file: any, threshold: number): ICoverageModule[] => {
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
        complexity = complexity + Number(summary.maxCyclomaticComplexity);

        if (file) {
          file.linesTotal += Number(summary.numSequencePoints);
          file.linesCovered += Number(summary.visitedSequencePoints);
          file.branchesTotal += Number(summary.numBranchPoints);
          file.branchesCovered += Number(summary.visitedBranchPoints);
          file.linesToCover = file.linesToCover.concat(
            lines.filter(line => !Number(line['$'].vc)).map(line => Number(line['$'].sl))
          );
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
    name: String(file['$'].fullPath).split(`${moduleName}\\`).slice(-1).pop() ?? '',
    totalCoverage: 0,
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

export default parseOpencover;
