import { ChangedFileWithLineNumbers } from './IActionInputs';
import ICoverage from './ICoverage';

type CoverageParser = (filePath: string, threshold: number, changedFilesAndLineNumbers: ChangedFileWithLineNumbers[]) => Promise<ICoverage | null>;

export default CoverageParser;
