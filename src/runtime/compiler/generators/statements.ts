import { Program, VariableDeclaration } from "../../../frontend/ast";
import { compile } from "../compiler";

export function compileProgram(program: Program): string {
  let programCode: string = `
    #include <stdio.h>
    #include <string.h>

    int main(void) {
      `;

  for (const statement of program.body) {
    programCode += compile(statement)
  }

  programCode += `
    return 0;
  }`;

  return programCode;
}

export function compileVariableDeclaration(
  declaration: VariableDeclaration,
): string {
  const value = declaration.value ? compile(declaration.value) : null;
  return `${declaration.value?.kind === "NumericLiteral" ?
    "float" :
    "char"
    } ${declaration.identifier}${!value ? ';' : ' = ' + value}`
}
