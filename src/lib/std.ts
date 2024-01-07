import Environment from "../runtime/environment";
import {
  AnonymousFunctionValue,
  BOOLEAN,
  FunctionValue,
  NATIVE_FUNCTION,
  NULL,
  NUMBER,
  NativeFunctionValue,
  OBJECT,
  ObjectValue,
  RuntimeValue,
  STRING,
} from "../runtime/values";

function printFunction(args: RuntimeValue[], scope: Environment) {
  function printFunctionStatement(
    fn: FunctionValue | AnonymousFunctionValue | NativeFunctionValue,
    scope: Environment,
    asText = true
  ): string {
    const params = new Map<string, RuntimeValue>();

    params.set("type", STRING(fn.type));

    if (fn.type === "function") {
      params.set("name", STRING(fn.name));
    }

    if (fn.type !== "native-function") {
      params.set("params", STRING(fn.parameters.join(", ")));
    } else {
      params.set("internalName", STRING(fn.callMethod.name));

      const bodySplit = fn.callMethod.toString().split("function(");
      const args = bodySplit[1].split(")")[0];
      
      params.set("params", STRING(args));
    }

    return printObject(params, scope, asText);
  }

  function getPrintText(arg: RuntimeValue, scope: Environment, asText = true) {
    let textToPrint: string = "";

    switch (arg.type) {
      case "boolean":
      case "null":
      case "number":
      case "string":
        textToPrint = arg.value.toString();
        break;

      case "object":
        textToPrint = printObject(arg.properties, scope);
        break;

      case "native-function":
      case "function":
      case "anonymous-function":
        textToPrint = printFunctionStatement(arg, scope, asText);
        break;
    }

    return textToPrint;
  }

  function printObject(
    props: Map<string, RuntimeValue>,
    scope: Environment,
    asString = true
  ): string | any {
    let text: any = {};

    props.forEach((value, key) => {
      if (value.type === "object") {
        text[key] = printObject(value.properties, scope, false);
      } else {
        text[key] = getPrintText(value, scope, false);
      }
    });

    if (asString) {
      return `object: ${JSON.stringify(text, null, ` `.repeat(4))}`;
    }

    return text;
  }

  let textToPrint: string = "";

  args.forEach((arg) => {
    textToPrint += " " + getPrintText(arg, scope);
  });

  console.log(textToPrint);
  return NULL();
}

function readFunction(args: RuntimeValue[], _scope: Environment) {
  if (args.length > 1 || args[0].type !== "string") {
    throw `Usage: read(string?)`;
  }

  const value = prompt(args[0].value);

  if (value === null) {
    return NULL();
  }

  if (value === "true" || value === "false") {
    return BOOLEAN(value === "true");
  }

  if (isNaN(parseInt(value))) {
    return STRING(value);
  }

  return NUMBER(parseInt(value));
}

export function std(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("print", NATIVE_FUNCTION(printFunction));
  props.set("read", NATIVE_FUNCTION(readFunction));

  return OBJECT(props);
}
