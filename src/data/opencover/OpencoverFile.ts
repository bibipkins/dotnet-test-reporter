import OpencoverModule from './OpencoverModule';
import OpencoverSummary from './OpencoverSummary';

type OpencoverFile = {
  CoverageSession: {
    Summary: OpencoverSummary[];
    Modules: { Module: OpencoverModule[] }[];
  };
};

export default OpencoverFile;
