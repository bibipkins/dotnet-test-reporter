import { IResult, TestOutcome } from '../data';
import { formatElapsedTime, getStatusIcon } from './common';

interface Element {
  tag: string;
  attributes?: { [index: string]: string };
}

interface Header {
  name: string;
  align?: 'left' | 'right' | 'center';
}

const outcomeIcons: { [key in TestOutcome]: string } = {
  Passed: '✔️',
  Failed: '❌',
  NotExecuted: '⚠️'
};

export const formatTitleHtml = (title: string): string => wrap(title, 'h1');

export const formatResultHtml = (result: IResult): string => {
  let html = wrap('Tests', 'h3');

  html += formatTable(
    [{ name: '✔️ Passed' }, { name: '❌ Failed' }, { name: '⚠️ Skipped' }, { name: '⏱️ Time' }],
    [[`${result.passed}`, `${result.failed}`, `${result.skipped}`, formatElapsedTime(result.elapsed)]]
  );

  for (const suit of result.suits) {
    const icon = getStatusIcon(suit.success);
    const summary = `${icon} ${suit.name} - ${suit.passed}/${suit.tests.length}`;
    const table = formatTable(
      [{ name: 'Test' }, { name: 'Result', align: 'center' }],
      suit.tests.map(test => [test.name, outcomeIcons[test.outcome]])
    );

    html += formatDetails(summary, table);
  }

  return html;
};

const wrap = (item: string, element: string | Element): string => {
  let tag: string = '';
  let attributes: string = '';

  if (typeof element === 'string') {
    tag = element;
  } else {
    tag = element.tag;
    attributes = element.attributes
      ? Object.keys(element.attributes)
          .map(a => `${a}="${element.attributes?.[a]}"`)
          .join(' ')
      : '';
  }

  return `<${tag} ${attributes}>${item}</${tag}>`;
};

const wrapMany = (items: string[], element: string | Element): string =>
  items.map(item => wrap(item, element)).join('');

const formatDetails = (summary: string, details: string): string =>
  wrap(`${wrap(summary, 'summary')}<br/>${details}`, 'details');

const formatColumn = (column: string, header: Header): string =>
  wrap(column, { tag: 'td', attributes: header.align ? { align: header.align } : undefined });

const formatTable = (headers: Header[], rows: string[][]): string => {
  const headerNames = headers.map(h => h.name);
  const headersData = wrapMany(headerNames, 'th');
  const headersHtml = wrap(headersData, 'tr');

  const rowsData = rows.map(row => row.map((column, i) => formatColumn(column, headers[i])).join(''));
  const rowsHtml = wrapMany(rowsData, 'tr');
  const bodyHtml = wrap(`${headersHtml}${rowsHtml}`, 'tbody');

  return wrap(bodyHtml, { tag: 'table', attributes: { role: 'table' } });
};
