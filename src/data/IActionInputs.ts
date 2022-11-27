import ITestConfig from './ITestConfig';

export default interface IActionInputs extends ITestConfig {
  token: string;
  postNewComment: boolean;
  configs: ITestConfig[];
}
