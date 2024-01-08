import { Statement } from "../frontend/ast";
import Environment from "./environment";

export type NullValue = {
  type: "null";
  value: "null";
};

export type NumberValue = {
  type: "number";
  value: number;
};

export type StringValue = {
  type: "string";
  value: string;
};

export type BooleanValue = {
  type: "boolean";
  value: boolean;
};

export type ObjectValue = {
  type: "object";
  properties: Map<string, RuntimeValue>;
};

export type ArrayValue = {
  type: "array";
  values: RuntimeValue[];
};

export type FunctionCall = (
  args: RuntimeValue[],
  env: Environment
) => RuntimeValue;

export type NativeFunctionValue = {
  type: "native-function";
  callMethod: FunctionCall;
};

export type FunctionValue = {
  type: "function";
  name: string;
  parameters: string[];
  declarationEnvironments: Environment;
  body: Statement[];
};

export type AnonymousFunctionValue = {
  type: "anonymous-function";
  parameters: string[];
  declarationEnvironments: Environment;
  body: Statement[];
};

export type RuntimeValue =
  | NullValue
  | NumberValue
  | BooleanValue
  | ObjectValue
  | ArrayValue
  | NativeFunctionValue
  | FunctionValue
  | AnonymousFunctionValue
  | StringValue;

export function NUMBER(number = 0): NumberValue {
  return {
    type: "number",
    value: number,
  };
}

export function STRING(text: string): StringValue {
  return {
    type: "string",
    value: text,
  };
}

export function NULL(): NullValue {
  return {
    type: "null",
    value: "null",
  };
}

export function BOOLEAN(value: boolean): BooleanValue {
  return {
    type: "boolean",
    value,
  };
}

export function NATIVE_FUNCTION(call: FunctionCall): NativeFunctionValue {
  return { callMethod: call, type: "native-function" };
}

export function OBJECT(properties: Map<string, RuntimeValue>): ObjectValue {
  return { type: "object", properties };
}

export function ARRAY(values: RuntimeValue[]): ArrayValue {
  return { type: "array", values };
}
