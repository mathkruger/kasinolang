import Environment from "../runtime/environment";
import { runUserDefinedFunction } from "../runtime/evaluate/expressions";
import {
  ObjectValue,
  NativeFunctionValue,
  NATIVE_FUNCTION,
  OBJECT,
  RuntimeValue,
  STRING,
  FunctionValue,
  NULL,
  AnonymousFunctionValue,
  StringValue,
  NumberValue,
} from "../runtime/values";
import { getPrintText } from "./std";

function serve(args: RuntimeValue[], scope: Environment) {
  const port = args[0] as NumberValue;
  const fn = args[1] as FunctionValue | AnonymousFunctionValue;

  Bun.serve({
    port: port.value,
    fetch(req) {
      const { url, method } = req;
      const response = runUserDefinedFunction(
        [STRING(url), STRING(method)],
        fn
      );
      return new Response(getPrintText(response, scope, false));
    },
  });

  return NULL();
}

export function network(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("serve", NATIVE_FUNCTION(serve));

  return OBJECT(props);
}
