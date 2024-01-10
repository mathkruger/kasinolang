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
  NumberValue,
  ArrayValue,
  StringValue,
} from "../runtime/values";

function serve(args: RuntimeValue[], scope: Environment) {
  const port = args[0] as NumberValue;
  const fn = args[1] as FunctionValue | AnonymousFunctionValue;

  const server = Bun.serve({
    port: port.value,
    async fetch(req) {
      const { method } = req;
      const url = new URL(req.url);
      const searchParams = new Map<string, RuntimeValue>();

      for (const s of url.searchParams) {
        searchParams.set(s[0], STRING(s[1]));
      }

      const urlObj = OBJECT(
        new Map<string, RuntimeValue>([
          ["queryParams", OBJECT(searchParams)],
          ["pathname", STRING(url.pathname)],
        ])
      );

      const response = runUserDefinedFunction(
        [urlObj, STRING(method)],
        fn
      ) as ArrayValue;

      const data = response.values[0] as StringValue;
      const type = response.values[1] as NumberValue;

      switch (type.value) {
        default:
          return new Response(data.value, {
            headers: {
              "Content-Type": "text/html",
            },
          });

        case 2:
          return new Response(data.value);

        case 3:
          return new Response(JSON.parse(data.value));
      }
    },
  });

  return OBJECT(
    new Map<string, RuntimeValue>([
      [
        "stop",
        NATIVE_FUNCTION((_a, _v) => {
          server.stop();
          return NULL();
        }),
      ],
      ["hostname", STRING(server.hostname)],
    ])
  );
}

export function network(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("serve", NATIVE_FUNCTION(serve));

  return OBJECT(props);
}
