import {
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Identifier,
  ObjectLiteral,
} from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import {
  RuntimeValue,
  NULL,
  NumberValue,
  NUMBER,
  ObjectValue,
  FunctionValue,
} from "../values";

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

export function evaluateObjectExpression(
  astNode: ObjectLiteral,
  env: Environment
): RuntimeValue {
  const object: ObjectValue = { type: "object", properties: new Map() };

  for (const { key, value } of astNode.properties) {
    const runtimeValue =
      value === undefined ? env.lookupVariable(key) : evaluate(value, env);
    object.properties.set(key, runtimeValue);
  }

  return object;
}

export function evaluateCallExpression(
  astNode: CallExpression,
  env: Environment
): RuntimeValue {
  const args = astNode.arguments.map(x => evaluate(x, env));
  const fn = evaluate(astNode.caller, env);
  
  if (fn.type === "native-function") {
    return fn.callMethod(args, env);
  }

  if (fn.type === "function") {
    const scope = new Environment(fn.declarationEnvironments);

    if (fn.parameters.length !== args.length) {
      throw `Interpreter error: ${fn.name} function expects ${fn.parameters.length} parameters, received ${args.length}`;
    }
    
    fn.parameters.forEach((param, index) => {
      scope.declareVariable(param, args[index], false);
    });

    let result: RuntimeValue = NULL();

    for (const x of fn.body) {
      result = evaluate(x, scope);
    };

    return result;
  }

  throw `Interpreter error: Cannot call value that is not a function: ${JSON.stringify(fn)}`;
}
