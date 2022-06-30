export default interface ITestCoverage {
  success: boolean;
  linesTotal: number;
  linesCovered: number;
  lineCoverage: number;
  branchCoverage: number;
  methodCoverage: number;
}
