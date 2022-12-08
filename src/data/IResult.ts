export default interface IResult {
  success: boolean;
  elapsed: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  tests: {
    name: string;
    suit: string;
    outcome: string;
  }[];
}
