import Environment from "../runtime/environment";
import {
  ObjectValue,
  NativeFunctionValue,
  NATIVE_FUNCTION,
  OBJECT,
  RuntimeValue,
  BOOLEAN,
} from "../runtime/values";

function isTrue(args: RuntimeValue[], _: Environment) {
  const value = args[0];

  if (value.type !== "boolean") {
    throw `assert.isTrue: the value must be a boolean!`;
  }

  return BOOLEAN(value.value === true);
}

function isFalse(args: RuntimeValue[], _: Environment) {
  const value = args[0];

  if (value.type !== "boolean") {
    throw `assert.isFalse: the value must be a boolean!`;
  }


  return BOOLEAN(value.value === false);
}


function isNull(args: RuntimeValue[], _: Environment) {
  const value = args[0];
  return BOOLEAN(value.type === "null");
}

function isNotNull(args: RuntimeValue[], _: Environment) {
  const value = args[0];
  return BOOLEAN(value.type !== "null");
}

export function assert(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("isTrue", NATIVE_FUNCTION(isTrue));
  props.set("isFalse", NATIVE_FUNCTION(isFalse));
  props.set("isNull", NATIVE_FUNCTION(isNull));
  props.set("isNotNull", NATIVE_FUNCTION(isNotNull));

  return OBJECT(props);
}
