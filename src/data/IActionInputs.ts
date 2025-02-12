import CoverageType from './CoverageType';

export type ChangedFileWithLineNumbers = {
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
  changedFilesAndLineNumbers: ChangedFileWithLineNumbers[];
  showFailedTestsOnly: boolean;
  showTestOutput: boolean;
}
