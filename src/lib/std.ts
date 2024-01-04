import Environment from "../runtime/environment";
import { NULL, NUMBER, RuntimeValue, STRING } from "../runtime/values";

export function printFunction(args: RuntimeValue[], scope: Environment) {
  let textToPrint: string = "";

  args.forEach(arg => {
    textToPrint += getPrintText(arg, scope);
  });

  console.log(textToPrint);
  return NULL();
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
      textToPrint = JSON.stringify(arg.callMethod);
    break;
  }

  return textToPrint;
}

function printObject(props: Map<string, RuntimeValue>, scope: Environment): string {
  let text = "{ ";

  props.forEach((value, key) => {
    text += `${key}: `;
    if (value.type === "object") {
      text += printObject(value.properties, scope);
    } else {
      text += getPrintText(value, scope);
    }
    text += ", ";
  });

  text += "}";

  return text;
}

export function readFunction(args: RuntimeValue[], _scope: Environment) {
  if (args.length > 1 || args[0].type !== "string") {
    throw `Usage: read(string?)`;
  }

  const value = prompt(args[0].value);

  if (value === null) {
    return NULL();
  }

  if (isNaN(parseInt(value))) {
    return STRING(value);
  }

  return NUMBER(parseInt(value));
}

export function timeFunction(_args: RuntimeValue[], _scope: Environment) {
  return STRING(new Date().toISOString());
}