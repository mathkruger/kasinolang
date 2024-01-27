import { describe, expect, it } from "bun:test";
import { createGlobalEnvironent } from "../../src/runtime/environment";
import {
  ARRAY,
  ArrayValue,
  FunctionValue,
  NUMBER,
  NativeFunctionValue,
  OBJECT,
  ObjectValue,
  RuntimeValue,
  STRING,
} from "../../src/runtime/values";
import { getNativeFunction } from "../helpers/get-native-function";

describe("network", () => {
  const env = createGlobalEnvironent();

  describe("string", () => {
    it("should return a string return type", () => {
      const func = getNativeFunction("network", "string", env);
      const result = func.callMethod([STRING("hey")], env) as ArrayValue;

      expect(result).toEqual(ARRAY([STRING("hey"), NUMBER(1)]));
    });
  });

  describe("html", () => {
    it("should return a html return type", () => {
      const func = getNativeFunction("network", "html", env);
      const result = func.callMethod(
        [STRING("<h1>hey</h1>")],
        env
      ) as ArrayValue;

      expect(result).toEqual(ARRAY([STRING("<h1>hey</h1>"), NUMBER(2)]));
    });
  });

  describe("json", () => {
    it("should return a json return type", () => {
      const func = getNativeFunction("network", "json", env);
      const result = func.callMethod(
        [OBJECT(new Map<string, RuntimeValue>([["hey", STRING("ya")]]))],
        env
      ) as ArrayValue;

      expect(result).toEqual(
        ARRAY([
          STRING(
            JSON.stringify({
              hey: "ya",
            })
          ),
          NUMBER(3),
        ])
      );
    });
  });

  describe("serve", () => {
    it("should serve a string", async () => {
      const func = getNativeFunction("network", "serve", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["url", "method"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "handle",
        body: [
          {
            kind: "CallExpression",
            caller: {
              kind: "MemberExpression",
              object: {
                kind: "Identifier",
                symbol: "network",
              },
              property: {
                kind: "Identifier",
                symbol: "string",
              },
            },
            arguments: [
              {
                kind: "StringLiteral",
                value: "Hello",
              },
            ],
          },
        ],
      };
      const result = func.callMethod(
        [NUMBER(6969), functionValue],
        env
      ) as ObjectValue;
      const serverResult = await (await fetch("http://localhost:6969")).text();

      expect(serverResult).toEqual("Hello");
      expect(result.properties.get("hostname")).toEqual(STRING("localhost"));

      const stopServiceFunction = result.properties.get("stop") as NativeFunctionValue;
      stopServiceFunction.callMethod([], env);
    });

    it("should serve a html", async () => {
      const func = getNativeFunction("network", "serve", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["queryParams", "pathname"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "handle",
        body: [
          {
            kind: "CallExpression",
            caller: {
              kind: "MemberExpression",
              object: {
                kind: "Identifier",
                symbol: "network",
              },
              property: {
                kind: "Identifier",
                symbol: "html",
              },
            },
            arguments: [
              {
                kind: "StringLiteral",
                value: "<h1>Hello, world!</h1><p>This is a page</p>",
              },
            ],
          },
        ],
      };
      const result = func.callMethod(
        [NUMBER(6969), functionValue],
        env
      ) as ObjectValue;
      const serverResult = await (await fetch("http://localhost:6969")).text();
      (result.properties.get("stop") as NativeFunctionValue).callMethod(
        [],
        env
      );

      expect(serverResult).toEqual("<h1>Hello, world!</h1><p>This is a page</p>");

      const stopServiceFunction = result.properties.get("stop") as NativeFunctionValue;
      stopServiceFunction.callMethod([], env);
    });

    it("should serve a json and handle a post request correctly", async () => {
      const func = getNativeFunction("network", "serve", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["queryParams", "pathname"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "handle",
        body: [
          {
            kind: "CallExpression",
            caller: {
              kind: "MemberExpression",
              object: {
                kind: "Identifier",
                symbol: "network",
              },
              property: {
                kind: "Identifier",
                symbol: "json",
              },
            },
            arguments: [
              {
                kind: "ObjectLiteral",
                properties: [
                  {
                    kind: "Property",
                    key: "foo",
                    value: {
                      kind: "StringLiteral",
                      value: "Test"
                    }
                  },
                  {
                    kind: "Property",
                    key: "bar",
                    value: {
                      kind: "StringLiteral",
                      value: "Test2"
                    }
                  }
                ]
              },
            ],
          },
        ],
      };
      const result = func.callMethod(
        [NUMBER(6969), functionValue],
        env
      ) as ObjectValue;

      const mockBody = new FormData();
      mockBody.set("foo", "bar");

      const serverResult = await (await fetch("http://localhost:6969?id=1", {
        method: "POST",
        body: mockBody
      })).text();

      (result.properties.get("stop") as NativeFunctionValue).callMethod(
        [],
        env
      );

      expect(serverResult).toEqual(JSON.stringify({
        foo: "Test",
        bar: "Test2"
      }));

      const stopServiceFunction = result.properties.get("stop") as NativeFunctionValue;
      stopServiceFunction.callMethod([], env);
    });
  });
});
