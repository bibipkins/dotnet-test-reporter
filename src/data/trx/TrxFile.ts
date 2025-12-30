import TrxResult from './TrxResult';
import TrxSummary from './TrxSummary';
import TrxTestDefinition from './TrxTestDefinition';

type TrxTime = {
  $: { start: string; finish: string };
};

type TrxFile = {
  TestRun: {
    Times: TrxTime[];
    ResultSummary: TrxSummary[];
    Results?: TrxResult[];
    TestDefinitions?: TrxTestDefinition[];
  };
};

export default TrxFile;
