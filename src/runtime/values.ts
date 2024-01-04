import Environment from "./environment";

export type NullValue = {
  type: "null",
  value: "null"
};

export type NumberValue = {
  type: "number",
  value: number
};

export type StringValue = {
  type: "string",
  value: string
};

export type BooleanValue = {
  type: "boolean",
  value: boolean
}

export type ObjectValue = {
  type: "object",
  properties: Map<string, RuntimeValue>
};

export type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue;

export type NativeFunctionValue = {
  type: "native-function",
  callMethod: FunctionCall
};

export type RuntimeValue = NullValue | NumberValue | BooleanValue | ObjectValue | NativeFunctionValue | StringValue;

export function NUMBER(number = 0): NumberValue {
  return {
    type: "number",
    value: number
  }
}

export function STRING(text: string): StringValue {
  return {
    type: "string",
    value: text
  };
}

export function NULL(): NullValue {
  return {
    type: "null",
    value: "null"
  }
}

export function BOOLEAN(value: boolean): BooleanValue {
  return {
    type: "boolean",
    value
  }
}

export function NATIVE_FUNCTION(call: FunctionCall): NativeFunctionValue {
  return { callMethod: call, type: "native-function" };
}