import OpencoverSummary from './OpencoverSummary';
import SequencePoint from './SequencePoint';

type FileRef = {
  $: { uid: string };
};

type OpencoverMethod = {
  FileRef: FileRef[];
  Summary: OpencoverSummary[];
  SequencePoints: { SequencePoint: SequencePoint[] }[];
};

export default OpencoverMethod;
