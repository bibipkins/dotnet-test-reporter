import fs from 'fs';
import xml2js from 'xml2js';
import { readXmlFile } from './files';

const existsSyncMock = jest.fn();
const readFileSyncMock = jest.fn();
const parseStringPromiseMock = jest.fn();

jest.mock('fs');
jest.mock('xml2js');

fs.existsSync = existsSyncMock;
fs.readFileSync = readFileSyncMock;

describe('files utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (xml2js.Parser as unknown as jest.Mock).mockImplementation(() => ({
      parseStringPromise: parseStringPromiseMock
    }));
  });

  it('returns null when file does not exist', async () => {
    existsSyncMock.mockReturnValue(false);

    const result = await readXmlFile('/path/to/nonexistent.xml');

    expect(result).toBeNull();
    expect(existsSyncMock).toHaveBeenCalledWith('/path/to/nonexistent.xml');
    expect(readFileSyncMock).not.toHaveBeenCalled();
    expect(parseStringPromiseMock).not.toHaveBeenCalled();
  });

  it('returns null when file read fails', async () => {
    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockImplementation(() => {
      throw new Error('Permission Denied');
    });

    const result = await readXmlFile('/path/to/file.xml');

    expect(result).toBeNull();
    expect(existsSyncMock).toHaveBeenCalledWith('/path/to/file.xml');
    expect(readFileSyncMock).toHaveBeenCalledWith('/path/to/file.xml');
  });

  it('returns null when xml parsing fails', async () => {
    const xmlContent = Buffer.from('invalid xml');

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(xmlContent);
    parseStringPromiseMock.mockRejectedValueOnce(new Error('Parse Error'));

    const result = await readXmlFile('/path/to/file.xml');

    expect(result).toBeNull();
    expect(parseStringPromiseMock).toHaveBeenCalledWith(xmlContent);
  });

  it('parses and returns xml file', async () => {
    type TestData = { root: { item: string[] } };

    const xmlContent = Buffer.from('<root><item>test</item></root>');
    const expectedData: TestData = { root: { item: ['test'] } };

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(xmlContent);
    parseStringPromiseMock.mockResolvedValue(expectedData);

    const result = await readXmlFile<TestData>('/path/to/file.xml');

    expect(result).toEqual(expectedData);
  });
});
