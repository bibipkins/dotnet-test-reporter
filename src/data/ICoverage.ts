export default interface ICoverage {
  success: boolean;
  linesTotal: number;
  linesCovered: number;
  lineCoverage: number;
  branchesTotal: number;
  branchesCovered: number;
  branchCoverage: number;
}
