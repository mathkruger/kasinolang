import { BinaryExpression, Program, Statement } from "../frontend/ast";
import { NullValue, NumberValue, RuntimeValue } from "./values";

function evaluateProgram(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = { type: "null", value: "null" };

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}

function evaluateBinaryExpression(
  binaryOperation: BinaryExpression
): RuntimeValue {
  const left = evaluate(binaryOperation.left);
  const right = evaluate(binaryOperation.right);

  if (left.type === "number" && right.type === "number") {
    return evaluateNumericBinaryExpression(left, right, binaryOperation.operator);
  }

  return { type: "null", value: "null" };
}

function evaluateNumericBinaryExpression(left: NumberValue, right: NumberValue, operator: string): NumberValue {
  let value = 0;

  switch (operator) {
    case "+":
      value = left.value + right.value;
    break;

    case "-":
      value = left.value - right.value;
    break;

    case "*":
      value = left.value * right.value;
    break;

    case "/":
      if (right.value === 0) {
        value = left.value >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else {
        value = left.value / right.value;
      }
    break;

    default:
      value = left.value % right.value;
    break;
  }

  return { value, type: "number" } as NumberValue;
}

export function evaluate(astNode: Statement): RuntimeValue {
  switch (astNode.kind) {
    case "Program":
      return evaluateProgram(astNode);

    case "NumericLiteral":
      return { value: astNode.value, type: "number" } as NumberValue;

    case "NullLiteral":
      return { value: "null" } as NullValue;

    case "BinaryExpression":
      return evaluateBinaryExpression(astNode);

    default:
      console.error(
        "This AST has not been implemented yet for interpretation:\n",
        astNode
      );
      process.exit(1);
  }
}
