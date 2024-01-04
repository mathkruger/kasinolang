import {
  AssignmentExpression,
  BinaryExpression,
  Identifier,
} from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeValue, NULL, NumberValue, NUMBER } from "../values";

export function evaluateBinaryExpression(
  binaryOperation: BinaryExpression,
  env: Environment
): RuntimeValue {
  const left = evaluate(binaryOperation.left, env);
  const right = evaluate(binaryOperation.right, env);

  if (left.type === "number" && right.type === "number") {
    return evaluateNumericBinaryExpression(
      left,
      right,
      binaryOperation.operator
    );
  }

  return NULL();
}

function evaluateNumericBinaryExpression(
  left: NumberValue,
  right: NumberValue,
  operator: string
): NumberValue {
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
        value =
          left.value >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else {
        value = left.value / right.value;
      }
      break;

    default:
      value = left.value % right.value;
      break;
  }

  return NUMBER(value);
}

export function evaluateIdentifier(
  astNode: Identifier,
  env: Environment
): RuntimeValue {
  const val = env.lookupVariable(astNode.symbol);
  return val;
}

export function evaluateAssignment(
  node: AssignmentExpression,
  env: Environment
): RuntimeValue {
  if (node.assigne.kind !== "Identifier") {
    throw `Interpreter error: Invalid left hand side assignment expression ${JSON.stringify(
      node.assigne
    )}`;
  }

  return env.assignVariable(node.assigne.symbol, evaluate(node.value, env));
}
