import { VariableValue } from "./variable-value";

export type CompilerResult = {
  code: string,
  variableValues: VariableValue[],
};
