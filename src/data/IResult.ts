import ITestSuit from './ITestSuit';

export default interface IResult {
  success: boolean;
  elapsed: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  suits: ITestSuit[];
}
