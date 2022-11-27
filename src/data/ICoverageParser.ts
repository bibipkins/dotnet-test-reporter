import ICoverage from './ICoverage';

export default interface ICoverageParser {
  parse: (filePath: string, threshold: number) => Promise<ICoverage | null>;
}
