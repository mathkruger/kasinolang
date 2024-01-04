export type NullValue = {
  type: "null",
  value: "null"
};

export type NumberValue = {
  type: "number",
  value: number
};

export type BooleanValue = {
  type: "boolean",
  value: boolean
}

export type ObjectValue = {
  type: "object",
  properties: Map<string, RuntimeValue>
};

export type RuntimeValue = NullValue | NumberValue | BooleanValue | ObjectValue;

export function NUMBER(number = 0): NumberValue {
  return {
    type: "number",
    value: number
  }
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