import { formatTitleHtml, formatResultHtml, formatCoverageHtml } from './html';
import type { IResult, ICoverage, ITestSuit } from '../data';

jest.mock('./common', () => ({
  formatElapsedTime: jest.fn(() => '1s'),
  getSectionLink: jest.fn((t: string) => t.toLowerCase().split(' ').join('-')),
  getStatusIcon: jest.fn((s: boolean) => (s ? '✅' : '❌'))
}));

const getSuccessfulSuit = (): ITestSuit => ({
  name: 'Suite 1',
  success: true,
  passed: 2,
  tests: [
    { name: 'test 1', output: '', error: '', trace: '', outcome: 'Passed' },
    { name: 'test 2', output: '', error: '', trace: '', outcome: 'Passed' }
  ]
});

const getFailingSuit = (): ITestSuit => ({
  name: 'Suite 2',
  success: false,
  passed: 1,
  tests: [
    { name: 'test 3', output: '', error: '', trace: '', outcome: 'Passed' },
    {
      name: 'test 4',
      output: 'Some output',
      error: 'Test error message',
      trace: 'Test stack trace',
      outcome: 'Failed'
    }
  ]
});

const getPassingResult = (): IResult =>
  ({
    success: true,
    elapsed: 1500,
    total: 2,
    passed: 2,
    failed: 0,
    skipped: 0,
    suits: [getSuccessfulSuit()]
  }) as IResult;

const getMixedResult = (): IResult =>
  ({
    success: false,
    elapsed: 2000,
    total: 2,
    passed: 1,
    failed: 1,
    skipped: 0,
    suits: [getFailingSuit()]
  }) as IResult;

const getCoverage = (): ICoverage =>
  ({
    success: true,
    totalCoverage: 90,
    changedLinesTotal: 4,
    changedLinesCovered: 2,
    changedLineCoverage: 50,
    linesTotal: 50,
    linesCovered: 45,
    lineCoverage: 90,
    branchesTotal: 10,
    branchesCovered: 8,
    branchCoverage: 80,
    modules: [
      {
        name: 'ModuleX',
        coverage: 90,
        complexity: 3,
        success: true,
        files: [
          {
            id: '1',
            name: 'file1.ts',
            fullPath: '/file1.ts',
            complexity: 5,
            linesToCover: [1, 2, 3, 5, 6],
            changedLinesTotal: 4,
            changedLinesCovered: 2,
            changedLineCoverage: 50,
            linesTotal: 100,
            linesCovered: 80,
            lineCoverage: 80,
            branchesTotal: 10,
            branchesCovered: 7,
            branchCoverage: 70
          }
        ]
      }
    ]
  }) as ICoverage;

describe('html formatting', () => {
  it('formatTitleHtml wraps title in a header with id from section link', () => {
    expect(formatTitleHtml('Hello World')).toBe('<h1 id="hello-world">Hello World</h1>');
  });

  describe('formatResultHtml', () => {
    it('renders the tests table headers and formatted elapsed time', () => {
      const result = getPassingResult();
      const html = formatResultHtml(result, false, false);

      expect(html).toContain('<h3>Tests</h3>');
      expect(html).toContain(
        '<table role="table"><tbody>' +
          '<tr><th>✔️ Passed</th><th>❌ Failed</th><th>⚠️ Skipped</th><th>⏱️ Time</th></tr>' +
          '<tr><td>2</td><td>0</td><td>0</td><td>1s</td></tr></tbody></table>'
      );
    });

    it('renders suit summary and the suit table with result and test columns', () => {
      const result = getPassingResult();
      const html = formatResultHtml(result, false, false);

      expect(html).toContain(
        '<details><summary>✅ Suite 1 - 2/2</summary><br/>' +
          '<table role="table"><tbody><tr><th>Result</th><th>Test</th></tr>' +
          '<tr><td align="center">✔️</td><td>test 1</td></tr>' +
          '<tr><td align="center">✔️</td><td>test 2</td></tr>' +
          '</tbody></table></details>'
      );
    });

    it('filters to failed tests when showFailedTestsOnly is true', () => {
      const result = getMixedResult();
      const html = formatResultHtml(result, true, false);

      expect(html).toContain(
        '<table role="table"><tbody>' +
          '<tr><th>Result</th><th>Test</th><th>Output</th></tr>' +
          '<tr><td align="center">❌</td><td>test 4</td><td>' +
          '<b>Error Message</b><br/>Test error message<br/><br/>' +
          '<b>Stack Trace</b><br/>Test stack trace</td></tr>' +
          '</tbody></table>'
      );
    });

    it('shows test output, error and trace when showTestOutput is true', () => {
      const result = getMixedResult();
      const html = formatResultHtml(result, true, true);

      expect(html).toContain(
        '<table role="table"><tbody>' +
          '<tr><th>Result</th><th>Test</th><th>Output</th></tr>' +
          '<tr><td align="center">❌</td><td>test 4</td><td>Some output<br/><br/>' +
          '<b>Error Message</b><br/>Test error message<br/><br/>' +
          '<b>Stack Trace</b><br/>Test stack trace</td></tr>' +
          '</tbody></table></details>'
      );
    });

    it('does not show test output when showTestOutput is false', () => {
      const result = getMixedResult();
      const html = formatResultHtml(result, true, false);

      expect(html).toContain(
        '<table role="table"><tbody>' +
          '<tr><th>Result</th><th>Test</th><th>Output</th></tr>' +
          '<tr><td align="center">❌</td><td>test 4</td><td>' +
          '<b>Error Message</b><br/>Test error message<br/><br/>' +
          '<b>Stack Trace</b><br/>Test stack trace</td></tr>' +
          '</tbody></table></details>'
      );
    });

    it('renders failed suits on top', () => {
      const result = getPassingResult();
      result.suits.push(getFailingSuit());
      result.success = false;
      result.passed += 1;
      result.failed += 1;
      result.total += 2;

      const html = formatResultHtml(result, false, false);
      const failingSuitIndex = html.indexOf('Suite 2');
      const successfulSuitIndex = html.indexOf('Suite 1');

      expect(failingSuitIndex).toBeLessThan(successfulSuitIndex);
    });
  });

  describe('formatCoverageHtml', () => {
    it('renders header and line/branch summary in the coverage table', () => {
      const coverage = getCoverage();
      const html = formatCoverageHtml(coverage);

      expect(html).toContain(
        '<h3>Coverage</h3>' +
          '<table role="table"><tbody>' +
          '<tr><th>📏 Line</th><th>🌿 Branch</th></tr>' +
          '<tr><td>45 / 50 (90%)</td><td>8 / 10 (80%)</td></tr>' +
          '</tbody></table>'
      );
    });

    it('renders module details with summary and file row containing lines-to-cover cell', () => {
      const coverage = getCoverage();
      const html = formatCoverageHtml(coverage);

      expect(html).toContain(
        '<details><summary>✅ ModuleX (3) - 90%</summary><br/>' +
          '<table role="table"><tbody>' +
          '<tr><th>File</th><th>Total</th><th>Line</th><th>Branch</th>' +
          '<th>Complexity</th><th>Changed Lines</th><th>Lines to Cover</th></tr>' +
          '<tr><td>file1.ts</td><td align="center">80 / 100</td>' +
          '<td align="center">80%</td><td align="center">70%</td>' +
          '<td align="center">5</td><td align="center">2 / 4 (50%)</td>' +
          '<td>1-3, 5, 6</td></tr>' +
          '</tbody></table></details>'
      );
    });
  });
});
