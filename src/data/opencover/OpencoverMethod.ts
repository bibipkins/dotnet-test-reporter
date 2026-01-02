import OpencoverSummary from './OpencoverSummary';

type FileRef = {
  $: { uid: string };
};

type SequencePoint = {
  $: {
    sl: string;
    vc: string;
    vs: string;
  };
};

type OpencoverMethod = {
  FileRef: FileRef[];
  Summary: OpencoverSummary[];
  SequencePoints: { SequencePoint: SequencePoint[] }[];
};

export default OpencoverMethod;
