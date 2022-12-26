import ICoverage from './ICoverage';

type CoverageParser = (filePath: string, threshold: number) => Promise<ICoverage | null>;

export default CoverageParser;
