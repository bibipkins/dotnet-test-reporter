import * as core from '@actions/core';
import fs from 'fs';
import path from 'path';
import { publishComment } from './comment';
import { parseTestResultsFile } from './parsers';

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
  const trxFiles = fileNames.filter(f => f.endsWith('.trx'));
  const filesWithAbsolutePaths = getAbsolutePaths(trxFiles, trxPath);
  filesWithAbsolutePaths.forEach(f => console.log(`File: ${f}`));
  return filesWithAbsolutePaths;
};

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token') || process.env['GITHUB_TOKEN'] || '';

    const trxPath = core.getInput('test-results');
    const filePaths = getFiles(trxPath);

    let elapsedTime = 0;

    for (const path of filePaths) {
      const result = await parseTestResultsFile(path);
      elapsedTime += result.elapsed;
    }

    const title = 'Test Results';
    const body = `:stopwatch: ${elapsedTime} ms\nUpdated comment 2!`;

    await publishComment(token, title, body);
  } catch (error: any) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
