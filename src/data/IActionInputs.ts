import CoverageType from './CoverageType';

export default interface IActionInputs {
  token: string;
  title: string;
  resultsPath: string;
  coveragePath: string;
  coverageType: CoverageType;
  coverageThreshold: number;
  postNewComment: boolean;
  allowFailedTests: boolean;
  onlyShowFailedTests: boolean;
  showTestOutput: boolean;
}
