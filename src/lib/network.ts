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
  ARRAY,
  NUMBER,
} from "../runtime/values";
import { printObject } from "./std";

function serve(args: RuntimeValue[], scope: Environment) {
  const port = args[0] as NumberValue;
  const fn = args[1] as FunctionValue | AnonymousFunctionValue;

  const server = Bun.serve({
    port: port.value,
    async fetch(req) {
      const { method } = req;
      const url = new URL(req.url);
      const searchParams = new Map<string, RuntimeValue>();
      const bodyParams = new Map<string, RuntimeValue>();

      for (const s of url.searchParams) {
        searchParams.set(s[0], STRING(s[1]));
      }

      if (method !== "GET") {
        const formData = await req.formData();

        for (const param of formData.entries()) {
          bodyParams.set(param[0], STRING(param[1] as string));
        }
      }

      const urlObj = OBJECT(
        new Map<string, RuntimeValue>([
          ["queryParams", OBJECT(searchParams)],
          ["body", OBJECT(bodyParams)],
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
          return new Response(data.value);

        case 2:
          return new Response(data.value, {
            headers: {
              "Content-Type": "text/html",
            },
          });

        case 3:
          return new Response(data.value, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      }
    },
  });

  return OBJECT(
    new Map<string, RuntimeValue>([
      [
        "stop",
        NATIVE_FUNCTION((_a, _v) => {
          server.stop(true);
          return NULL();
        }),
      ],
      ["hostname", STRING(server.hostname)],
    ])
  );
}

function string(args: RuntimeValue[], _: Environment): RuntimeValue {
  const data = args[0] as StringValue;

  return ARRAY([
    data,
    NUMBER(1)
  ]);
}

function html(args: RuntimeValue[], _: Environment): RuntimeValue {
  const data = args[0] as StringValue;

  return ARRAY([
    data,
    NUMBER(2)
  ]);
}

function json(args: RuntimeValue[], scope: Environment): RuntimeValue {
  const data = args[0] as ObjectValue;
  const result = printObject(data.properties, scope, false);

  return ARRAY([
    STRING(JSON.stringify(result)),
    NUMBER(3)
  ]);
}

export function network(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("serve", NATIVE_FUNCTION(serve));
  props.set("json", NATIVE_FUNCTION(json));
  props.set("html", NATIVE_FUNCTION(html));
  props.set("string", NATIVE_FUNCTION(string));

  return OBJECT(props);
}
