type TrxCounter = {
  $: { total: string; passed: string; failed: string; executed: string };
};

type TrxSummary = {
  $: { outcome: string };
  Counters: TrxCounter[];
};

export default TrxSummary;
