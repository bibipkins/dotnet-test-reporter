import { ICoverage, ICoverageFile } from '../data';
import {
  formatHeaderMarkdown,
  formatFooterMarkdown,
  formatSummaryLinkMarkdown,
  formatResultMarkdown,
  formatCoverageMarkdown,
  formatChangedFileCoverageMarkdown
} from './markdown';

jest.mock('./common', () => ({
  formatElapsedTime: jest.fn(() => '1s'),
  getSectionLink: jest.fn((t: string) => t.toLowerCase().split(' ').join('-')),
  getStatusIcon: jest.fn((s: boolean) => (s ? '✅' : '❌'))
}));

describe('markdown formatting', () => {
  it('formatHeaderMarkdown produces markdown header', () => {
    expect(formatHeaderMarkdown('Hello')).toBe('## Hello\n');
  });

  it('formatFooterMarkdown trims commit to 7 characters', () => {
    const commit = 'abcdef123456';
    expect(formatFooterMarkdown(commit)).toBe('<br/>_✏️ updated for commit abcdef1_');
  });

  it('formatSummaryLinkMarkdown builds correct link', () => {
    const link = formatSummaryLinkMarkdown('https://github.com', 'owner', 'repo', 123, 'My Section');

    expect(link).toBe(
      '🔍 click [here](' +
        'https://github.com/owner/repo/actions/runs/123#user-content-my-section' +
        ') for more details\n'
    );
  });

  describe('formatResultMarkdown', () => {
    it('formats result correctly when all tests passed', () => {
      const result = formatResultMarkdown({
        total: 10,
        passed: 10,
        failed: 0,
        skipped: 0,
        success: true,
        elapsed: 1000,
        suits: []
      });

      expect(result).toBe('✅ Tests **10 / 10** - **passed** in 1s\n');
    });

    it('formats result correctly when there are failed and skipped tests', () => {
      const result = formatResultMarkdown({
        total: 5,
        passed: 3,
        failed: 1,
        skipped: 1,
        success: false,
        elapsed: 2000,
        suits: []
      });

      expect(result).toBe('❌ Tests **3 / 5** (1 failed, 1 skipped) - **failed** in 1s\n');
    });
  });

  describe('formatCoverageMarkdown', () => {
    it('formats coverage without threshold', () => {
      const coverage = formatCoverageMarkdown(
        {
          totalCoverage: 85,
          linesCovered: 85,
          linesTotal: 100,
          branchesTotal: 10,
          branchesCovered: 8,
          success: true
        } as ICoverage,
        0
      );

      const expected = '📝 Coverage **85%** \n📏 85 / 100 lines covered 🌿 8 / 10 branches covered\n';

      expect(coverage).toBe(expected);
    });

    it('formats coverage with threshold', () => {
      const coverage = formatCoverageMarkdown(
        {
          totalCoverage: 85,
          linesCovered: 85,
          linesTotal: 100,
          branchesTotal: 10,
          branchesCovered: 8,
          success: true
        } as ICoverage,
        80
      );

      const expected =
        '✅ Coverage **85%** - **passed** with 80% threshold\n' +
        '📏 85 / 100 lines covered 🌿 8 / 10 branches covered\n';

      expect(coverage).toBe(expected);
    });
  });

  it('formatChangedFileCoverageMarkdown builds a table for files', () => {
    const result = formatChangedFileCoverageMarkdown([
      {
        name: 'file1.ts',
        complexity: 5,
        changedLineCoverage: 50,
        changedLinesTotal: 4,
        changedLinesCovered: 2,
        linesCovered: 80,
        linesTotal: 100,
        lineCoverage: 80
      } as ICoverageFile
    ]);

    const expected =
      '<details>\n<summary>Results</summary>\n\n' +
      '| Filename | Complexity | Lines Covered | Changed Lines Covered |\n' +
      '|----------|------------|---------------|-----------------------|\n' +
      '| file1.ts | 5 | 80 / 100 (80%) | 2 / 4 (50%) |\n' +
      '\n\n</details>\n\n';

    expect(result).toBe(expected);
  });
});
