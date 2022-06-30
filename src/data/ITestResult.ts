export default interface ITestResult {
  success: boolean;
  elapsed: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}
