export default interface IResult {
  success: boolean;
  elapsed: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  tests: {
    name: string;
    className: string;
    outcome: string;
  }[];
}
