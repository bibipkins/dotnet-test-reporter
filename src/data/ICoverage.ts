export default interface ICoverage {
  success: boolean;
  linesTotal: number;
  linesCovered: number;
  lineCoverage: number;
  branchesTotal: number;
  branchesCovered: number;
  branchCoverage: number;
  modules: {
    name: string;
    files: {
      id: string;
      name: string;
      linesTotal: number;
      linesCovered: number;
      lineCoverage: number;
    }[];
  }[];
}
