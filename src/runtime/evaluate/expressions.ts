import {
  AnonymousFunctionExpression,
  ArrayLiteral,
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Identifier,
  MemberExpression,
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
  AnonymousFunctionValue,
  BooleanValue,
  BOOLEAN,
  ArrayValue,
} from "../values";

export function evaluateBinaryExpression(
  binaryOperation: BinaryExpression,
  env: Environment
): RuntimeValue {
  const left = evaluate(binaryOperation.left, env);
  const right = evaluate(binaryOperation.right, env);

  if ((left.type === "number" || left.type === "boolean") && (right.type === "number" || right.type === "boolean")) {
    return evaluateNumericBinaryExpression(
      left,
      right,
      binaryOperation.operator
    );
  }

  return NULL();
}

function evaluateNumericBinaryExpression(
  left: NumberValue | BooleanValue,
  right: NumberValue | BooleanValue,
  operator: string
): NumberValue | BooleanValue {
  if (left.type !== right.type) {
    throw `Interpretor error: Cannot evaluate binary expressions between different types`;
  }

  if (left.type === "number" && right.type === "number") {
    let value: boolean | number = 0;

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
  
      case "%":
        value = left.value % right.value;
        break;
      
      case "==":
        value = left.value == right.value;
        break;

      case ">":
        value = left.value > right.value;
        break;

      case "<":
        value = left.value < right.value;
        break;

      case ">=":
        value = left.value >= right.value;
        break;

      case "<=":
        value = left.value <= right.value;
        break;
      
      default: 
        throw `Interpreter error: cannot use ${operator} operator with numbers`;
    }

    return typeof value === "number" ? NUMBER(value) : BOOLEAN(value);
  } else {
    const leftBool = left as BooleanValue;
    const rightBool = right as BooleanValue;

    switch(operator) {
      case "==":
        return BOOLEAN(leftBool.value == rightBool.value);

      case "&":
        return BOOLEAN(leftBool.value && rightBool.value);
      
      case "|":
        return BOOLEAN(leftBool.value || rightBool.value);
      
      default:
        throw `Interpreter error: canno use ${operator} operator with booleans`;
    }
  }
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

export function evaluateMemberExpression(
  member: MemberExpression,
  env: Environment
): RuntimeValue {
  const objectValue = evaluate(member.object, env);
  const propertySymbol = member.property.symbol;

  if (objectValue.type !== "object") {
    throw `Interpreter error: Cannot get member from a non-object!`;
  }

  if (!objectValue.properties.has(propertySymbol)) {
    throw `Interpreter error: property ${propertySymbol} does not exists!`;
  }

  return objectValue.properties.get(propertySymbol) as RuntimeValue;
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

  if (fn.type === "function" || fn.type === "anonymous-function") {
    const scope = new Environment(fn.declarationEnvironments);

    if (fn.parameters.length !== args.length) {
      throw `Interpreter error: ${fn.type === "function" ? fn.name : "anonymous"} function expects ${fn.parameters.length} parameters, received ${args.length}`;
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

export function evaluateAnonymousFunctionExpression(
  astNode: AnonymousFunctionExpression,
  env: Environment
): RuntimeValue {
  const fn: AnonymousFunctionValue = {
    type: "anonymous-function",
    parameters: astNode.parameters,
    declarationEnvironments: env,
    body: astNode.body
  };

  return fn;
}

export function evaluateArray(
  array: ArrayLiteral,
  env: Environment
) {
  const values: RuntimeValue[] = [];
  array.values.forEach(v => {
    values.push(evaluate(v, env));
  });

  const result: ArrayValue = {
    type: "array",
    values
  };

  return result;
}