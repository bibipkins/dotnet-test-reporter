import { ICoverage, ICoverageParser } from '../data';
import { readXmlFile } from '../utils';

export default class CoberturaParser implements ICoverageParser {
  public async parse(filePath: string, threshold: number): Promise<ICoverage | null> {
    const file = await readXmlFile(filePath);

    if (!file) {
      return null;
    }

    const summary = this.parseSummary(file);
    const success = !threshold || summary.lineCoverage >= threshold;

    return { success, ...summary };
  }

  private parseSummary(file: any) {
    const data = file.coverage['$'];

    return {
      linesTotal: data['lines-valid'],
      linesCovered: data['lines-covered'],
      lineCoverage: Math.round(data['line-rate'] * 10000) / 100,
      branchesTotal: data['branches-valid'],
      branchesCovered: data['branches-covered'],
      branchCoverage: Math.round(data['branch-rate'] * 10000) / 100
    };
  }
}
