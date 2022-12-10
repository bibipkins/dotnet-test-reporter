import { IResult, TestOutcome } from '../data';

const outcomeIcons: { [key in TestOutcome]: string } = {
  Passed: '✔️',
  Failed: '❌',
  NotExecuted: '⚠️'
};

export const formatResultSummary = (title: string, result: IResult): string => {
  let html = wrap(title, 'h1') + wrap('Tests', 'h3');

  for (const suit of result.suits) {
    const icon = suit.success ? '✔️' : '❌';
    const summary = `${icon} ${suit} - ${suit.passed}/${suit.tests.length}`;
    const table = formatTable(
      ['Test', 'Result'],
      suit.tests.map(test => [test.name, outcomeIcons[test.outcome]])
    );

    html += formatDetails(summary, table);
  }

  return html;
};

const wrap = (item: string, element: string): string => `<${element}>${item}</${element}>`;

const wrapMany = (items: string[], element: string): string => items.map(i => wrap(i, element)).join('');

const formatDetails = (summary: string, details: string): string => wrap(wrap(summary, 'summary') + details, 'details');

const formatTable = (headers: string[], rows: string[][]): string => {
  const data = rows.map(row => wrapMany(row, 'td'));
  const rowsHtml = wrapMany(data, 'tr');
  const headerHtml = wrap(wrapMany(headers, 'th'), 'tr');
  const bodyHtml = wrap(`${headerHtml}${rowsHtml}`, 'tbody');

  return `<table role="table">${bodyHtml}</table>`;
};
