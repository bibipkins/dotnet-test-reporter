type TrxTestMethod = {
  $: { codeBase: string; adapterTypeName: string; className: string; name: string };
};

type TrxTestDefinition = {
  UnitTest: {
    $: {
      id: string;
      name: string;
      storage: string;
      Description?: { $: { value: string } }[];
      Execution?: { $: { id: string } }[];
      TestMethod?: TrxTestMethod[];
    };
    Description: string[];
    Execution: { $: { id: string } }[];
    TestMethod: TrxTestMethod[];
  }[];
};

export default TrxTestDefinition;
