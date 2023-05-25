import ICoverageFile from './ICoverageFile';

export default interface ICoverageModule {
  name: string;
  coverage: number;
  complexity: number;
  success: boolean;
  files: ICoverageFile[];
}
