import path from 'path';
import parseTrx from './trx';

describe('trx parser', () => {
  it('parses failed test error details from standard trx', async () => {
    const filePath = path.resolve(__dirname, '../../files/fail/test_result.trx');
    const result = await parseTrx(filePath);

    expect(result).not.toBeNull();

    const failedTests = result!.suits.flatMap(suit => suit.tests).filter(test => test.outcome === 'Failed');

    expect(failedTests.length).toBeGreaterThan(0);
    expect(failedTests.some(test => test.error.length > 0)).toBe(true);
  });

  it('parses and flattens nested DataRow results from inner results', async () => {
    const filePath = path.resolve(__dirname, '../../files/fail/test_result_datarow.trx');
    const result = await parseTrx(filePath);

    expect(result).not.toBeNull();

    const allTests = result!.suits.flatMap(suit => suit.tests);

    // Should find both parent and inner result
    expect(allTests.length).toBe(2);

    // Find the parameterized inner result with error details
    const innerTest = allTests.find(t => t.name.includes('(addDays:'));
    expect(innerTest).toBeDefined();
    expect(innerTest!.outcome).toBe('Failed');
    expect(innerTest!.error).toContain('Assert.AreEqual failed');
    expect(innerTest!.trace).toContain('OTARunnerTests.cs:line 42');
  });

  it('parses failed DataRow message from inner results', async () => {
    const filePath = path.resolve(__dirname, '../../files/fail/test_result_datarow.trx');
    const result = await parseTrx(filePath);

    expect(result).not.toBeNull();

    const suit = result!.suits.find(s => s.name === 'Example.Tests.OTARunnerTests');
    expect(suit).toBeDefined();

    // Find the parameterized row with the error details
    const test = suit!.tests.find(t => t.name.includes('(addDays:'));
    expect(test).toBeDefined();
    expect(test!.outcome).toBe('Failed');
    expect(test!.error).toContain('Assert.AreEqual failed');
    expect(test!.trace).toContain('OTARunnerTests.cs:line 42');
  });

  it('prefers row-level DataRow failure details when testId is shared', async () => {
    const filePath = path.resolve(__dirname, '../../files/fail/test_result_datarow_shared_testid.trx');
    const result = await parseTrx(filePath);

    expect(result).not.toBeNull();

    const suit = result!.suits.find(s => s.name === 'Example.Tests.OTARunnerTests');
    expect(suit).toBeDefined();

    // The parameterized row should have the row-level error details
    const test = suit!.tests.find(t => t.name.includes('(addDays:'));
    expect(test).toBeDefined();
    expect(test!.outcome).toBe('Failed');
    expect(test!.error).toContain('DataRow shared-id mismatch');
    expect(test!.trace).toContain('OTARunnerTests.cs:line 55');
  });
});
