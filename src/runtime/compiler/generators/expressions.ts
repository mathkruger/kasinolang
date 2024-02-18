import { NumericLiteral, StringLiteral } from "../../../frontend/ast";

export function compileNumericLiteral(numericLiteral: NumericLiteral): string {
  return `${numericLiteral.value};\n`;
}

export function compileStringLiteral(stringLiteral: StringLiteral): string {
  return `"${stringLiteral.value}";\n`;
}
