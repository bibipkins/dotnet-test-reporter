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

    return modules.map(module => ({
      name: String(module.ModuleName[0]),
      classes: module.Classes[0].Class.map(c => ({
        name: String(c.FullName[0]),
        linesTotal: Number(c.Summary[0]['$'].numSequencePoints),
        linesCovered: Number(c.Summary[0]['$'].visitedSequencePoints),
        lineCoverage: Number(c.Summary[0]['$'].sequenceCoverage)
      }))
    }));
  }
}
