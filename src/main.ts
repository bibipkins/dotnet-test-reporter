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
  console.log(`0`);
  if (!fs.existsSync(trxPath)) {
    console.log(`No files =()`);
    return [];
  }

  console.log(`1. Files exist`);
  const fileNames = fs.readdirSync(trxPath);
  console.log(`2. Files count: ${fileNames.length}`);
  const trxFiles = fileNames.filter(f => f.endsWith('.trx'));
  console.log(`3. TRX Files count: ${fileNames.length}`);
  const filesWithAbsolutePaths = getAbsolutePaths(trxFiles, trxPath);
  console.log(`4`);
  filesWithAbsolutePaths.forEach(f => console.log(`File: ${f}`));
  console.log(`5`);
  return filesWithAbsolutePaths;
};

const run = () => {
  try {
    const trxPath = core.getInput('test-results');
    console.log(`TRX Path: ${trxPath}`);
    getFiles(trxPath);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
