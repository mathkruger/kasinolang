import Environment from "../runtime/interpreter/environment";
import {
  NATIVE_FUNCTION,
  NUMBER,
  NativeFunctionValue,
  OBJECT,
  ObjectValue,
  RuntimeValue,
} from "../runtime/interpreter/values";

function powerFunction(x: RuntimeValue[], _: Environment) {
  if (x.length !== 2) {
    throw `math.power: power expects 2 parameters: base and exponent`;
  }

  if (x[0].type !== "number" || x[1].type !== "number") {
    throw `math.power: base and exponent must be numbers!`;
  }

  return NUMBER(Math.pow(x[0].value, x[1].value));
}

function rootFunction(x: RuntimeValue[], env: Environment) {
  if (x.length !== 2) {
    throw `math.nthroot: nthroot expects 2 parameters: number and root`;
  }

  if (x[0].type !== "number" || x[1].type !== "number") {
    throw `math.nthroot: number and root must be numbers!`;
  }

  return powerFunction([
    x[0], NUMBER(1 / x[1].value)
  ], env);
}

export function math(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("power", NATIVE_FUNCTION(powerFunction));
  props.set("nthroot", NATIVE_FUNCTION(rootFunction));

  return OBJECT(props);
}
