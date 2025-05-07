import { Program, VariableDeclaration } from "../../../frontend/ast";
import { compile } from "../compiler";
import { VariableValue } from "../types/variable-value";

export function compileProgram(program: Program, variableValues: VariableValue[]) {
  let code: string = ``;

  for (const statement of program.body) {
    code += compile(statement, variableValues);
  }

  code += `HALT`;

  return { code, variableValues };
}

export function compileVariableDeclaration(
  declaration: VariableDeclaration,
  variableValues: VariableValue[]
) {
  if (declaration.value === undefined) {
    throw `Not allowed to declare a variable without a value`;
  }

  if (
    declaration.value.kind !== "NumericLiteral" &&
    declaration.value.kind !== "StringLiteral"
  ) {
    throw `Not allowed to declare a variable with a ${declaration.value?.kind}`;
  }

  if (variableValues.find(x => x.identifier === declaration.identifier)) {
    throw `Variable ${declaration.identifier} was already declared`;
  }
  
  const value = compile(declaration.value, variableValues);
  const type = declaration.value.kind === "NumericLiteral" ? "INT" : "STR";

  const registerName = Math.max(...variableValues.map(x => x.registerNumber)) + 1;
  variableValues.push({
    identifier: declaration.identifier,
    registerNumber: registerName,
    value: value.code
  });

  return {
    code: `MOVV ${type} R${registerName} ${type === "STR" ? '"' : ""}${value}${type === "STR" ? '"' : ""}`,
    variableValues,
  };
}
