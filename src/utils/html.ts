import { IResult, TestOutcome } from '../data';

interface Header {
  name: string;
  style?: string;
}

const outcomeIcons: { [key in TestOutcome]: string } = {
  Passed: '✔️',
  Failed: '❌',
  NotExecuted: '⚠️'
};

export const formatSummaryTitle = (title: string): string => wrap(title, 'h1');

export const formatResultSummary = (result: IResult): string => {
  let html = wrap('Tests', 'h3');

  for (const suit of result.suits) {
    const icon = suit.success ? '✔️' : '❌';
    const summary = `${icon} ${suit.name} - ${suit.passed}/${suit.tests.length}`;
    const table = formatTable(
      [{ name: 'Test' }, { name: 'Result', style: 'text-align: center;' }],
      suit.tests.map(test => [test.name, outcomeIcons[test.outcome]])
    );

    html += formatDetails(summary, table);
  }

  return html;
};

const wrap = (item: string, element: string, props?: { [index: string]: string }): string => {
  let attributes: string[] = [];

  for (const attribute in props) {
    attributes.push(`${attribute}="${props[attribute]}"`);
  }

  return `<${element} ${attributes.join(' ')}>${item}</${element}>`;
};

const wrapMany = (items: string[], element: string, props?: { [index: string]: string }): string =>
  items.map(i => wrap(i, element, props)).join('');

const formatDetails = (summary: string, details: string): string =>
  wrap(`${wrap(summary, 'summary')}<br/>${details}`, 'details');

const formatTable = (headers: Header[], rows: string[][]): string => {
  const headerNames = headers.map(h => h.name);
  const headersData = wrapMany(headerNames, 'th');
  const headersHtml = wrap(headersData, 'tr');

  const rowsData = rows.map(row => row.map((column, i) => formatColumn(column, headers[i])).join(''));
  const rowsHtml = wrapMany(rowsData, 'tr');
  const bodyHtml = wrap(`${headersHtml}${rowsHtml}`, 'tbody');

  return wrap(bodyHtml, 'table', { role: 'table' });
};

const formatColumn = (column: string, header: Header): string =>
  wrap(column, 'td', header.style ? { style: header.style ?? '' } : undefined);
