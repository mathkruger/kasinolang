export type ValueType = "null" | "number";

export type NullValue = {
  type: "null",
  value: "null"
};

export type NumberValue = {
  type: "number",
  value: number
};

export type RuntimeValue = NullValue | NumberValue;