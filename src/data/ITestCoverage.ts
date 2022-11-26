export default interface ITestCoverage {
  success: boolean;
  linesTotal: number;
  linesCovered: number;
  lineCoverage: number;
  branchesTotal: number;
  branchesCovered: number;
  branchCoverage: number;
}
