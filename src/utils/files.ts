import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import xml2js from 'xml2js';

export const readXmlFile = async (filePath: string): Promise<any> => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const file = fs.readFileSync(filePath);
    const parser = new xml2js.Parser();
    return await parser.parseStringPromise(file);
  } catch {
    return null;
  }
};

export const findFiles = (directoryPath: string, extension: string): string[] => {
  try {
    console.log(globSync(directoryPath, { withFileTypes: true }).map(p => `${p.fullpath()} ${p.isDirectory()}`));

    if (!fs.existsSync(directoryPath)) {
      return [];
    }

    const fileNames = fs.readdirSync(directoryPath);
    const filteredFileNames = fileNames.filter(fileName => fileName.endsWith(extension));
    return filteredFileNames.map(fileName => path.join(directoryPath, fileName));
  } catch {
    return [];
  }
};
