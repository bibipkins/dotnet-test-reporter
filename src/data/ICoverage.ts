import ICoverageData from './ICoverageData';
import ICoverageModule from './ICoverageModule';

export default interface ICoverage extends ICoverageData {
  success: boolean;
  modules: ICoverageModule[];
}
