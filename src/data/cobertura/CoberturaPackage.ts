import CoberturaClass from './CoberturaClass';

type CoberturaPackage = {
  $: {
    name: string;
    complexity: string;
  };
  classes: { class: CoberturaClass[] }[];
};

export default CoberturaPackage;
