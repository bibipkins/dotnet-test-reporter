import * as core from '@actions/core';

import { publishComment } from './comment';
import { getTestResultPaths } from './files';
import { parseTestResultsFile } from './parsers';

const getTimeString = (elapsed: number) => {
  if (elapsed >= 120000) {
    return `${Math.abs(elapsed / 120000)}min`;
  } else if (elapsed >= 1000) {
    return `${Math.abs(elapsed / 1000)}s`;
  } else {
    return `${elapsed}ms`;
  }
};

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token') || process.env['GITHUB_TOKEN'] || '';
    const trxPath = core.getInput('test-results');
    const filePaths = getTestResultPaths(trxPath);

    let elapsedTime = 0;
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const path of filePaths) {
      const result = await parseTestResultsFile(path);
      elapsedTime += result.elapsed;
      total += result.total;
      passed += result.passed;
      failed += result.failed;
      skipped += result.skipped;
    }

    const title = 'Test Results';
    const body =
      `${failed ? `:red_circle: **FAIL**` : `:green_circle: **SUCCESS**`}` +
      `&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;` +
      `:stopwatch: ${getTimeString(elapsedTime)}\n` +
      `:memo: Total | :heavy_check_mark: Passed | :x: Failed | :warning: Skipped\n` +
      `--- | --- | --- | ---\n` +
      `${total} | ${passed} | ${failed} | ${skipped}\n\n`;

    await publishComment(token, title, body);
  } catch (error: any) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
