import { Statement, VariableDeclaration } from "../frontend/ast";
import Environment from "./environment";
import { evaluateIdentifier, evaluateBinaryExpression, evaluateAssignment } from "./evaluate/expressions";
import { evaluateProgram, evaluateVariableDeclaration } from "./evaluate/statements";
import { NUMBER, RuntimeValue } from "./values";

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
  switch (astNode.kind) {
    // Statements
    case "Program":
      return evaluateProgram(astNode, env);

    case "VariableDeclaration":
      return evaluateVariableDeclaration(astNode, env);

    // Expressions
    case "NumericLiteral":
      return NUMBER(astNode.value);

    case "Identifier":
      return evaluateIdentifier(astNode, env);

    case "BinaryExpression":
      return evaluateBinaryExpression(astNode, env);
    
    case "AssignmentExpression":
      return evaluateAssignment(astNode, env);

    default:
      throw `Interpreter error: This AST has not been implemented yet for interpretation:\n${JSON.stringify(astNode)}`;
  }
}

