import ITest from './ITest';

export default interface ITestSuit {
  name: string;
  success: boolean;
  passed: number;
  tests: ITest[];
}
