import IResult from './IResult';

export default interface IResultParser {
  parse: (filePath: string) => Promise<IResult | null>;
}
