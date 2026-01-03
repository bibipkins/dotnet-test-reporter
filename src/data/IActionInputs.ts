import type CoverageType from './CoverageType';

export type ChangedFile = {
  name: string;
  lineNumbers: number[];
};

export default interface IActionInputs {
  token: string;
  title: string;
  resultsPath: string;
  coveragePath: string;
  coverageType: CoverageType;
  coverageThreshold: number;
  postNewComment: boolean;
  allowFailedTests: boolean;
  changedFiles: ChangedFile[];
  showFailedTestsOnly: boolean;
  showTestOutput: boolean;
  serverUrl: string;
  pullRequestCheck: boolean;
  pullRequestCheckName: string;
}
