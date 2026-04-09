import TestOutcome from '../TestOutcome';

type TrxResultOutput = {
  StdOut?: string[];
  ErrorInfo?: { Message?: string[]; StackTrace?: string[] }[];
};

type TrxUnitTestResult = {
  $: {
    executionId?: string;
    testId?: string;
    testName?: string;
    testType?: string;
    testListId?: string;
    computerName?: string;
    duration?: string;
    startTime?: string;
    endTime?: string;
    outcome: TestOutcome;
    relativeResultsDirectory?: string;
  };
  Output?: TrxResultOutput[];
  InnerResults?: { UnitTestResult: TrxUnitTestResult[] }[];
};

type TrxResult = {
  UnitTestResult: TrxUnitTestResult[];
};

export default TrxResult;
