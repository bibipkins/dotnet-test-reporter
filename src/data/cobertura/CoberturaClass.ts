type Line = {
  $: {
    number: string;
    hits: string;
    ['condition-coverage']: string;
  };
};

type CoberturaClass = {
  $: {
    filename: string;
    complexity: string;
  };
  lines: { line: Line[] }[];
};

export default CoberturaClass;
