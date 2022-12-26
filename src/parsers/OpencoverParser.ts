import { ICoverage, ICoverageParser } from '../data';
import { readXmlFile } from '../utils';

export default class OpencoverParser implements ICoverageParser {
  public async parse(filePath: any, threshold: number): Promise<ICoverage | null> {
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

  private parseModules(file: any) {
    const modules = file.CoverageSession.Modules?.[0]?.Module as any[];

    return modules.map(module => {
      const name = String(module.ModuleName[0]);
      const fileData = module.Files[0].File as any[];
      const classData = module.Classes[0].Class as any[];

      const files = fileData.map(file => ({
        id: String(file['$'].uid),
        name: String(file['$'].fullPath).split(name).slice(-1).pop() ?? '',
        linesTotal: 0,
        linesCovered: 0,
        lineCoverage: 0
      }));

      classData.forEach(c => {
        const methods = c.Methods[0].Method as any[];

        methods.forEach(m => {
          const file = files.find(f => f.id === m.FileRef[0]['$'].uid);

          if (file) {
            file.linesTotal += Number(m.Summary[0]['$'].numSequencePoints);
            file.linesCovered += Number(m.Summary[0]['$'].visitedSequencePoints);
            file.lineCoverage += Number(m.Summary[0]['$'].sequenceCoverage);
          }
        });
      });

      return { name, files };
    });
  }
}
