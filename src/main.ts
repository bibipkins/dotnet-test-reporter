const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');
const path = require('path');

const getAbsolutePaths = (fileNames: string[], directoryName: string): string[] => {
  const absolutePaths: string[] = [];

  for (const file of fileNames) {
    const absolutePath = path.join(directoryName, file);
    absolutePaths.push(absolutePath);
  }

  return absolutePaths;
};

const getFiles = (trxPath: string): string[] => {
  console.log(`TRX Path: ${trxPath}`);
  if (!fs.existsSync(trxPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(trxPath);
  console.log(`Files count: ${fileNames.length}`);
  const trxFiles = fileNames.filter(f => f.endsWith('.trx'));
  console.log(`TRX Files count: ${trxFiles.length}`);
  const filesWithAbsolutePaths = getAbsolutePaths(trxFiles, trxPath);
  filesWithAbsolutePaths.forEach(f => console.log(`File: ${f}`));
  return filesWithAbsolutePaths;
};

const run = () => {
  try {
    const trxPath = core.getInput('test-results');
    getFiles(trxPath);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
