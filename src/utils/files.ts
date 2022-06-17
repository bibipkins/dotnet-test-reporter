import fs from 'fs';
import path from 'path';

export const getTestResultPaths = (path: string): string[] => {
  if (!fs.existsSync(path)) {
    console.log('No test result files found');
    return [];
  }

  const fileNames = fs.readdirSync(path);
  const trxFiles = fileNames.filter(name => name.endsWith('.trx'));
  const absolutePaths = getAbsolutePaths(trxFiles, path);
  absolutePaths.forEach(path => console.log(`File: ${path}`));

  return absolutePaths;
};

const getAbsolutePaths = (fileNames: string[], directoryName: string): string[] =>
  fileNames.map(fileName => path.join(directoryName, fileName));
