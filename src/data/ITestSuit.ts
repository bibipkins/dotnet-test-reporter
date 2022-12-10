import TestOutcome from './TestOutcome';

export default interface ITestSuit {
  name: string;
  success: boolean;
  passed: number;
  tests: {
    name: string;
    outcome: TestOutcome;
  }[];
}
