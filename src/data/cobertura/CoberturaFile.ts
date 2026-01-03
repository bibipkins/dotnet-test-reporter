import CoberturaPackage from './CoberturaPackage';

type CoberturaFile = {
  coverage: {
    $: {
      'lines-covered': string;
      'lines-valid': string;
      'branches-covered': string;
      'branches-valid': string;
    };
    sources?: { source: string }[];
    packages: { package: CoberturaPackage[] }[];
  };
};

export default CoberturaFile;
