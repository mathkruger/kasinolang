import Environment from "../runtime/environment";
import { ObjectValue, NativeFunctionValue, NATIVE_FUNCTION, OBJECT, RuntimeValue, STRING, StringValue, BOOLEAN } from "../runtime/values";

function equals(args: RuntimeValue[], _: Environment) {
  const first = args[0];
  const second = args[1];

  if (first.type !== "string" || second.type !== "string") {
    throw `string.equals: both arguments must be strings!`;
  }

  return BOOLEAN(first.value === second.value);
}

function concat(args: RuntimeValue[], _: Environment) {
  const first = args[0];
  const separator = args[1];
  const second = args[2];

  if (first.type !== "string" || second.type !== "string" || separator.type !== "string") {
    throw `string.concat: all arguments must be strings!`;
  }

  return STRING(`${first.value}${separator.value}${second.value}`);
}

export function string(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("equals", NATIVE_FUNCTION(equals));
  props.set("concat", NATIVE_FUNCTION(concat));

  return OBJECT(props);
}