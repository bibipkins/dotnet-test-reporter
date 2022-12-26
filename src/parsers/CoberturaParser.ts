import { ICoverage, ICoverageParser } from '../data';
import { readXmlFile } from '../utils';
import { normalize } from './common';

export default class CoberturaParser implements ICoverageParser {
  public async parse(filePath: string, threshold: number): Promise<ICoverage | null> {
    const file = await readXmlFile(filePath);

    if (!file) {
      return null;
    }

    const summary = this.parseSummary(file);
    const modules = this.parseModules(file, threshold);
    const success = !threshold || summary.lineCoverage >= threshold;

    return { success, ...summary, modules };
  }

  private parseSummary(file: any) {
    const summary = file.coverage['$'];

    return {
      linesTotal: Number(summary['lines-valid']),
      linesCovered: Number(summary['lines-covered']),
      lineCoverage: normalize(summary['line-rate']),
      branchesTotal: Number(summary['branches-valid']),
      branchesCovered: Number(summary['branches-covered']),
      branchCoverage: normalize(summary['branch-rate'])
    };
  }

  private parseModules(file: any, threshold: number) {
    const modules = file.coverage.packages?.[0]?.package as any[];

    return modules.map(module => {
      const name = String(module['$'].name);
      const classData = module.classes[0].class as any[];
      const fileNames = [...new Set(classData.map(c => String(c['$'].filename)))];

      const files = fileNames
        .map(file => ({
          id: file,
          name: file,
          linesTotal: 0,
          linesCovered: 0,
          lineCoverage: 0,
          branchesTotal: 0,
          branchesCovered: 0,
          branchCoverage: 0
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      classData.forEach(c => {
        const file = files.find(f => f.id === String(c['$'].filename));
        const lines = c.lines[0].line as any[];
        const branchRegex = /\(([^)]+)\)/;
        const branchData = lines
          .filter(l => l['$']['condition-coverage'])
          .map(l => branchRegex.exec(String(l['$']['condition-coverage']))?.[1].split('/') ?? []);

        if (file) {
          file.linesTotal += Number(lines.length);
          file.linesCovered += Number(lines.filter(l => Number(l['$'].hits) > 0).length);
          file.branchesTotal += branchData.reduce((summ, branch) => summ + Number(branch[1]), 0);
          file.branchesCovered += branchData.reduce((summ, branch) => summ + Number(branch[0]), 0);
        }
      });

      files.forEach(file => {
        file.lineCoverage = file.linesTotal ? normalize(file.linesCovered / file.linesTotal) : 100;
        file.branchCoverage = file.branchesTotal ? normalize(file.branchesCovered / file.branchesTotal) : 100;
      });

      const linesTotal = files.reduce((summ, file) => summ + file.linesTotal, 0);
      const linesCovered = files.reduce((summ, file) => summ + file.linesCovered, 0);
      const coverage = linesTotal ? normalize(linesCovered / linesTotal) : 100;
      const success = !threshold || coverage >= threshold;

      return { name, coverage, success, files };
    });
  }
}
