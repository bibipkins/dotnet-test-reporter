import { ICoverage, ICoverageParser } from '../data';
import { readXmlFile } from '../utils';
import { normalize } from './common';

export default class OpencoverParser implements ICoverageParser {
  public async parse(filePath: any, threshold: number): Promise<ICoverage | null> {
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
    const summary = file.CoverageSession?.Summary?.[0]?.['$'];

    return {
      linesTotal: Number(summary.numSequencePoints),
      linesCovered: Number(summary.visitedSequencePoints),
      lineCoverage: Number(summary.sequenceCoverage),
      branchesTotal: Number(summary.numBranchPoints),
      branchesCovered: Number(summary.visitedBranchPoints),
      branchCoverage: Number(summary.branchCoverage)
    };
  }

  private parseModules(file: any, threshold: number) {
    const modules = file.CoverageSession.Modules?.[0]?.Module as any[];

    return modules.map(module => {
      const name = String(module.ModuleName[0]);
      const fileData = module.Files[0].File as any[];
      const classData = module.Classes[0].Class as any[];

      const files = fileData
        .map(file => ({
          id: String(file['$'].uid),
          name: String(file['$'].fullPath).split(`${name}\\`).slice(-1).pop() ?? '',
          linesTotal: 0,
          linesCovered: 0,
          lineCoverage: 0,
          branchesTotal: 0,
          branchesCovered: 0,
          branchCoverage: 0
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      classData.forEach(c => {
        const methods = c.Methods[0].Method as any[];

        methods.forEach(m => {
          const file = files.find(f => f.id === m.FileRef[0]['$'].uid);
          const summary = m.Summary[0]['$'];

          if (file) {
            file.linesTotal += Number(summary.numSequencePoints);
            file.linesCovered += Number(summary.visitedSequencePoints);
            file.branchesTotal += Number(summary.numBranchPoints);
            file.branchesCovered += Number(summary.visitedBranchPoints);
          }
        });
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
