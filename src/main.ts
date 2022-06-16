import core from '@actions/core';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

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

const readNodeData = (node: any): any => {
  return node['$'];
};

const getElapsedTime = (trx: any): number => {
  const times = trx.TestRun?.Times;

  if (times && times.length) {
    const data = readNodeData(times[0]);
    const start = new Date(data.start);
    console.log(start);
    const finish = new Date(data.finish);
    console.log(finish);
    var milisconds = finish.getTime() - start.getTime();
    console.log(milisconds);
    return milisconds;
  }

  return 0;
};

const run = async () => {
  try {
    const trxPath = core.getInput('test-results');
    const filePaths = getFiles(trxPath);

    for (const path of filePaths) {
      const parser = new xml2js.Parser();
      const file = fs.readFileSync(path);
      const result = await parser.parseStringPromise(file);
      getElapsedTime(result);
    }
  } catch (error: any) {
    console.log(error);
    core.setFailed(error.message);
  }
};

run();
