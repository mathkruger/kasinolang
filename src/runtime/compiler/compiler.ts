import { Statement } from "../../frontend/ast";
import { compileNumericLiteral, compileStringLiteral } from "./generators/expressions";
import { compileProgram, compileVariableDeclaration } from "./generators/statements";
import { CompilerResult } from "./types/compiler-result";
import { VariableValue } from "./types/variable-value";

export function compile(astNode: Statement, variableValues: VariableValue[]): CompilerResult {
  let code: string = ``;

  switch (astNode.kind) {
    // Statements
    case "Program":
      var result = compileProgram(astNode, variableValues);
      code += result.code;
      variableValues = result.variableValues;
      break;

    case "VariableDeclaration":
      var result = compileVariableDeclaration(astNode, variableValues);
      code += result.code;
      variableValues = result.variableValues;
      break;

    case "FunctionDeclaration":
      break;
    case "IfDeclaration":
      break;
    case "WhileDeclaration":
      break;
    case "ImportDeclaration":
      break;
    // Expressions
    case "NumericLiteral":
      code += compileNumericLiteral(astNode);
      break;

    case "StringLiteral":
      code += compileStringLiteral(astNode);
      break;

    case "ArrayLiteral":
      break;
    case "Identifier":
      break;
    case "ObjectLiteral":
      break;
    case "CallExpression":
      break;
    case "MemberExpression":
      break;
    case "ArrayIndexExpression":
      break;
    case "BinaryExpression":
      break;
    case "AssignmentExpression":
      break;
    case "AnonymousFunctionExpression":
      break;
    default:
      throw `Compiler error: This AST has not been implemented yet for compilation:\n${JSON.stringify(
        astNode
      )}`;
  }

  return { code, variableValues };
}
