import { FunctionValue, NATIVE_FUNCTION, NUMBER, NativeFunctionValue, NumberValue, OBJECT, ObjectValue, RuntimeValue } from "../runtime/values";

export function math(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("power", NATIVE_FUNCTION((x, _) => {
    if (x.length !== 2) {
      throw `power expects 2 parameters: base and exponent`;
    } 

    if (x[0].type !== "number" || x[1].type !== "number") {
      throw `base and exponent must be numbers!`;
    }

    return NUMBER(Math.pow(x[0].value, x[1].value));
  }));

  return OBJECT(props);
}

