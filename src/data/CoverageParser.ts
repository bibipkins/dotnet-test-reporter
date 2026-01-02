import { ChangedFile } from './IActionInputs';
import ICoverage from './ICoverage';

type CoverageParser = (
  filePath: string,
  threshold: number,
  changedFiles: ChangedFile[]
) => Promise<ICoverage | null>;

export default CoverageParser;
