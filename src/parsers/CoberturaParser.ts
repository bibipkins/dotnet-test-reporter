import { ICoverage, ICoverageParser } from '../data';
import { readXmlFile } from '../utils';

export default class CoberturaParser implements ICoverageParser {
  public async parse(filePath: string, threshold: number): Promise<ICoverage | null> {
    const file = await readXmlFile(filePath);

    if (!file) {
      return null;
    }

    const summary = this.parseSummary(file);
    const modules = this.parseModules(file);
    const success = !threshold || summary.lineCoverage >= threshold;

    return { success, ...summary, modules };
  }

  private parseSummary(file: any) {
    const summary = file.coverage['$'];

    return {
      linesTotal: Number(summary['lines-valid']),
      linesCovered: Number(summary['lines-covered']),
      lineCoverage: this.normalize(summary['line-rate']),
      branchesTotal: Number(summary['branches-valid']),
      branchesCovered: Number(summary['branches-covered']),
      branchCoverage: this.normalize(summary['branch-rate'])
    };
  }

  private parseModules(file: any) {
    const modules = file.coverage.packages?.[0]?.package as any[];

    return modules.map(module => {
      const name = String(module['$'].name);
      const classData = module.classes[0].class as any[];
      const fileNames = [...new Set(classData.map(c => String(c['$'].filename)))];

      const files = fileNames.map(file => ({
        id: file,
        name: file,
        linesTotal: 0,
        linesCovered: 0,
        lineCoverage: 0
      }));

      classData.forEach(c => {
        const file = files.find(f => f.id === String(c['$'].filename));

        if (file) {
          file.linesTotal += Number(c.lines[0].line.length);
          file.linesCovered += Number(c.lines[0].line.filter(l => Number(l['$'].hits) > 0).length);
          file.lineCoverage += this.normalize(c['$']['line-rate']);
        }
      });

      return { name, files };
    });
  }

  private normalize(rate: number) {
    return Math.round(rate * 10000) / 100;
  }
}
