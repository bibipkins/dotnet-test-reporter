import ICoverageData from './ICoverageData';

export default interface ICoverageFile extends ICoverageData {
  name: string;
  complexity: number;
  linesToCover: number[];
}
