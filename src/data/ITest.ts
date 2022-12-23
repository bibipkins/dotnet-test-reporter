import TestOutcome from './TestOutcome';

export default interface ITest {
  name: string;
  output: string;
  error: string;
  trace: string;
  outcome: TestOutcome;
}
