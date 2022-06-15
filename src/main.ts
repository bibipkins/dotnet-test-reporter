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
  if (!fs.existsSync(trxPath)) {
    return [];
  }

  console.log(`1. Files exist`);
  const fileNames = fs.readdir(trxPath);
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
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput('time', time);
    // Get the JSON webhook payload for the event that triggered the workflow

    //const payload = JSON.stringify(github.context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);

    const trxPath = core.getInput('test-results');
    console.log(`Path: ${trxPath}`);
    getFiles(trxPath);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
