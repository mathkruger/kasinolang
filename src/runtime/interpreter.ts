import { Statement } from "../frontend/ast";
import Environment from "./environment";
import {
  evaluateIdentifier,
  evaluateBinaryExpression,
  evaluateAssignment,
  evaluateObjectExpression,
  evaluateCallExpression,
  evaluateAnonymousFunctionExpression,
  evaluateMemberExpression,
} from "./evaluate/expressions";
import {
  evaluateFunctionDeclaration,
  evaluateIfDeclaration,
  evaluateProgram,
  evaluateVariableDeclaration,
  evaluateWhileDeclaration,
} from "./evaluate/statements";
import { NUMBER, RuntimeValue, STRING } from "./values";

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
  switch (astNode.kind) {
    // Statements
    case "Program":
      return evaluateProgram(astNode, env);

    case "VariableDeclaration":
      return evaluateVariableDeclaration(astNode, env);

    case "FunctionDeclaration":
      return evaluateFunctionDeclaration(astNode, env);

    case "IfDeclaration":
      return evaluateIfDeclaration(astNode, env);

    case "WhileDeclaration":
      return evaluateWhileDeclaration(astNode, env);

    // Expressions
    case "NumericLiteral":
      return NUMBER(astNode.value);

    case "StringLiteral":
      return STRING(astNode.value);

    case "Identifier":
      return evaluateIdentifier(astNode, env);

    case "ObjectLiteral":
      return evaluateObjectExpression(astNode, env);

    case "CallExpression":
      return evaluateCallExpression(astNode, env);

    case "MemberExpression":
      return evaluateMemberExpression(astNode, env);

    case "BinaryExpression":
      return evaluateBinaryExpression(astNode, env);

    case "AssignmentExpression":
      return evaluateAssignment(astNode, env);

    case "AnonymousFunctionExpression":
      return evaluateAnonymousFunctionExpression(astNode, env);

    default:
      throw `Interpreter error: This AST has not been implemented yet for interpretation:\n${JSON.stringify(
        astNode
      )}`;
  }
}
