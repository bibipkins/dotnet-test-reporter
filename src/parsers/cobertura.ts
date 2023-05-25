import { CoverageParser, ICoverageData, ICoverageModule } from '../data';
import { calculateCoverage, createCoverageModule, parseCoverage } from './common';

const parseCobertura: CoverageParser = async (filePath: string, threshold: number) =>
  parseCoverage(filePath, threshold, parseSummary, parseModules);

const parseSummary = (file: any): ICoverageData => {
  const summary = file.coverage['$'];
  const totalCoverage = calculateCoverage(
    Number(summary['lines-covered']) + Number(summary['branches-covered']),
    Number(summary['lines-valid']) + Number(summary['branches-valid'])
  );

  return {
    totalCoverage,
    linesTotal: Number(summary['lines-valid']),
    linesCovered: Number(summary['lines-covered']),
    lineCoverage: calculateCoverage(summary['lines-covered'], summary['lines-valid']),
    branchesTotal: Number(summary['branches-valid']),
    branchesCovered: Number(summary['branches-covered']),
    branchCoverage: calculateCoverage(summary['branches-covered'], summary['branches-valid'])
  };
};

const parseModules = (file: any, threshold: number): ICoverageModule[] => {
  const modules = (file.coverage.packages[0].package ?? []) as any[];

  return modules.map(module => {
    const name = String(module['$'].name);
    const classes = (module.classes[0].class ?? []) as any[];
    const files = parseFiles(classes);
    const complexity = Number(module['$'].complexity)

    classes.forEach(c => {
      const file = files.find(f => f.name === String(c['$'].filename));
      const lines = (c.lines[0].line ?? []) as any[];
      const branchRegex = /\(([^)]+)\)/;
      const branchData = lines
        .filter(l => l['$']['condition-coverage'])
        .map(l => branchRegex.exec(String(l['$']['condition-coverage']))?.[1].split('/') ?? []);

      if (file) {
        file.linesTotal += Number(lines.length);
        file.linesCovered += Number(lines.filter(l => Number(l['$'].hits) > 0).length);
        file.branchesTotal += branchData.reduce((summ, branch) => summ + Number(branch[1]), 0);
        file.branchesCovered += branchData.reduce((summ, branch) => summ + Number(branch[0]), 0);
        file.linesToCover = file.linesToCover.concat(
          lines.filter(line => !Number(line['$'].hits)).map(line => Number(line['$'].number))
        );
        file.complexity = Number(c['$'].complexity)
      }
    });

    return createCoverageModule(name, threshold, files, complexity);
  });
};

const parseFiles = (classes: any[]) => {
  const fileNames = [...new Set(classes.map(c => String(c['$'].filename)))];

  return fileNames.map(file => ({
    name: file,
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

export default parseCobertura;
