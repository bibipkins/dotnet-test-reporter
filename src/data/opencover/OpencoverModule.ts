import OpencoverMethod from './OpencoverMethod';

type OpencoverFile = {
  $: {
    uid: string;
    fullPath: string;
  };
};

type OpencoverClass = {
  Methods: { Method: OpencoverMethod[] }[];
};

type OpencoverModule = {
  ModuleName: string[];
  Classes: { Class: OpencoverClass[] }[];
  Files: { File: OpencoverFile[] }[];
};

export default OpencoverModule;
