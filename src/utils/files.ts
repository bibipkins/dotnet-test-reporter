import fs from 'fs';
import xml2js from 'xml2js';
import path from 'path';
import { globSync } from 'glob';

export const readXmlFile = async (path: string): Promise<any> => {
  try {
    const paths = globSync(path, { withFileTypes: true });
    console.log(paths);

    if (!paths.length) {
      return null;
    }

    console.log(paths[0].path);
    const file = fs.readFileSync(paths[0].path);
    const parser = new xml2js.Parser();
    return await parser.parseStringPromise(file);
  } catch {
    return null;
  }
};

export const findFiles = (directoryPath: string, extension: string): string[] => {
  try {
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
