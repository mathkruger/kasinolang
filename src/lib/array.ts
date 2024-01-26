import Environment from "../runtime/environment";
import { runUserDefinedFunction } from "../runtime/evaluate/expressions";
import {
  RuntimeValue,
  NUMBER,
  ObjectValue,
  NativeFunctionValue,
  NATIVE_FUNCTION,
  OBJECT,
  STRING,
  NULL,
  ARRAY,
  StringValue,
} from "../runtime/values";

function len(args: RuntimeValue[], _scope: Environment) {
  const object = args[0];

  const value =
    object.type === "array"
      ? object.values.length
      : object.type === "string"
        ? object.value.length
        : undefined;

  return NUMBER(value);
}

function at(args: RuntimeValue[], _scope: Environment) {
  const object = args[0];
  const index = args[1];

  if (index.type !== "number") {
    throw `array: at function expects a index number`;
  }

  const values =
    object.type === "array"
      ? object.values
      : object.type === "string"
        ? object.value
        : undefined;

  if (values === undefined) {
    throw `array.at: cannot access index from ${index.type}`;
  }

  const result = values[index.value];

  return typeof result === "string" ? STRING(result) : result;
}


function map(args: RuntimeValue[], _scope: Environment) {
  const array = args[0];
  const fn = args[1];

  if (array.type !== "array") {
    throw `array.map: cannot map values from other type than array`;
  }

  if (fn.type !== "function") {
    throw `array.map: need to pass a function to map`;
  }

  const result = array.values.map((x, index) => {
    return runUserDefinedFunction([x, NUMBER(index)], fn);
  });

  return ARRAY(result);
}

function foreach(args: RuntimeValue[], _scope: Environment) {
  const array = args[0];
  const fn = args[1];

  if (array.type !== "array") {
    throw `array.foreach: cannot iterate over values from other type than array`;
  }

  if (fn.type !== "function") {
    throw `array.foreach: need to pass a function to foreach`;
  }

  array.values.forEach((x, index) => {
    runUserDefinedFunction([x, NUMBER(index)], fn);
  });

  return NULL();
}

function push(args: RuntimeValue[], _scope: Environment) {
  const object = args[0];
  const value = args[1];

  if (object.type !== "array") {
    throw `array.push: You can only push to arrays`;
  }

  object.values.push(value);

  return object;
}

function pop(args: RuntimeValue[], _scope: Environment) {
  const object = args[0];

  if (object.type !== "array") {
    throw `array.pop: You can only pop from arrays`;
  }

  return object.values.pop() || ARRAY([]);
}

function join(args: RuntimeValue[], _scope: Environment) {
  const object = args[0];
  const separator = args[1];

  if (object.type !== "array") {
    throw `array.join: You can only join array items`;
  }

  if (separator.type !== "string") {
    throw `array.join: the separator must be a string`;
  }

  if (!object.values.every(x => x.type === "string")) {
    throw `array.join: you can only join array of strings!`;
  }

  const result = STRING(object.values.map(x => {
    return (x as StringValue).value;
  }).join(separator.value));
  return result;
}

export function array(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("len", NATIVE_FUNCTION(len));
  props.set("at", NATIVE_FUNCTION(at));
  props.set("map", NATIVE_FUNCTION(map));
  props.set("foreach", NATIVE_FUNCTION(foreach));
  props.set("push", NATIVE_FUNCTION(push));
  props.set("pop", NATIVE_FUNCTION(pop));
  props.set("join", NATIVE_FUNCTION(join));

  return OBJECT(props);
}
