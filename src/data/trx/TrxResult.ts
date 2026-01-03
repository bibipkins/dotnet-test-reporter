import TestOutcome from '../TestOutcome';

type TrxResultOutput = {
  StdOut?: string[];
  ErrorInfo?: { Message?: string[]; StackTrace?: string[] }[];
};

type TrxResult = {
  UnitTestResult: {
    $: {
      executionId: string;
      testId: string;
      testName: string;
      testType: string;
      testListId: string;
      computerName: string;
      duration: string;
      startTime: string;
      endTime: string;
      outcome: TestOutcome;
      relativeResultsDirectory: string;
    };
    Output?: TrxResultOutput[];
  }[];
};

export default TrxResult;
