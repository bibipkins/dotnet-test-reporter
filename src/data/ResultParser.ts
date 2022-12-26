import IResult from './IResult';

type ResultParser = (filePath: string) => Promise<IResult | null>;

export default ResultParser;
