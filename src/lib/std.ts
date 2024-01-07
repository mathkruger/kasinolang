import Environment from "../runtime/environment";
import { AnonymousFunctionValue, BOOLEAN, FunctionValue, NATIVE_FUNCTION, NULL, NUMBER, NativeFunctionValue, OBJECT, ObjectValue, RuntimeValue, STRING } from "../runtime/values";

function printFunction(args: RuntimeValue[], scope: Environment) {
  function printFunction(fn: FunctionValue | AnonymousFunctionValue, scope: Environment): string {
    const params = new Map<string, RuntimeValue>();
    
    if (fn.type === "function") {
      params.set("name", STRING(fn.name));
    }

    params.set("params", STRING(fn.parameters.join(", ")));

    return printObject(params, scope, fn.type);
  }

  function getPrintText(arg: RuntimeValue, scope: Environment) {
    let textToPrint: string = "";
  
    switch(arg.type) {
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
        textToPrint = JSON.stringify(arg);
      break;
  
      case "function":
      case "anonymous-function":
        textToPrint = printFunction(arg, scope);
      break;
    }
  
    return textToPrint;
  }
  
  function printObject(props: Map<string, RuntimeValue>, scope: Environment, objectType = "object"): string {
    let text = objectType + "[";
  
    props.forEach((value, key) => {
      text += `${key} = `;
      if (value.type === "object") {
        text += printObject(value.properties, scope);
      } else {
        text += getPrintText(value, scope);
      }
      text += ", ";
    });

    text += "]"
  
    return text;
  }

  let textToPrint: string = "";

  args.forEach(arg => {
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