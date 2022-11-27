import { ICoverage, ICoverageParser } from '../data';
import { readXmlFile } from '../utils';

export default class OpencoverParser implements ICoverageParser {
  public async parse(filePath: any, threshold: number): Promise<ICoverage | null> {
    const file = await readXmlFile(filePath);

    if (!file) {
      return null;
    }

    const summary = this.parseSummary(file);
    const success = !threshold || summary.lineCoverage >= threshold;

    return { success, ...summary };
  }

  private parseSummary(file: any) {
    const data = file.CoverageSession?.Summary[0]['$'];

    return {
      linesTotal: data.numSequencePoints,
      linesCovered: data.visitedSequencePoints,
      lineCoverage: data.sequenceCoverage,
      branchesTotal: data.numBranchPoints,
      branchesCovered: data.visitedBranchPoints,
      branchCoverage: data.branchCoverage
    };
  }
}
