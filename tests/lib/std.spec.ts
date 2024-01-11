import { describe, expect, it, jest, mock, spyOn } from "bun:test";
import Environment, { createGlobalEnvironent } from "../../src/runtime/environment";
import { ARRAY, AnonymousFunctionValue, BOOLEAN, FunctionValue, NULL, NUMBER, NullValue, NumberValue, OBJECT, RuntimeValue, STRING, StringValue } from "../../src/runtime/values";
import { getNativeFunction } from "../helpers/get-native-function";
import { readObject } from "../../src/lib/std";

describe("std", () => {
  const env = createGlobalEnvironent();

  describe("print", () => {
    it("should print a string", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([STRING("EZ")], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("EZ");
    });

    it("should print a number", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([NUMBER(123)], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("123");
    });

    it("should print a boolean", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([BOOLEAN(true)], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("true");
    });

    it("should print a string", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([STRING("EZ")], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("EZ");
    });

    it("should print null", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([NULL()], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("null");
    });

    it("should print an array", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([ARRAY([
        NUMBER(1),
        NUMBER(2),
        NUMBER(3),
        NULL(),
        STRING("AOBA")
      ])], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith(JSON.stringify([
        "1",
        "2",
        "3",
        "null",
        "AOBA"
      ], null, ` `.repeat(4)));
    });

    it("should print an object", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([OBJECT(new Map<string, RuntimeValue>([
        ["test", NULL()],
        ["another", NUMBER(1)],
        ["foobar", STRING("EZ")],
      ]))], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("object: " + JSON.stringify({
        test: "null",
        another: "1",
        foobar: "EZ"
      }, null, ` `.repeat(4)));
    });

    it("should print a native function", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      func.callMethod([func], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("object: " + JSON.stringify({
        type: "native-function",
        internalName: "print",
        params: "args, scope"
      }, null, ` `.repeat(4)));
    });

    it("should print a anonymous function", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      const fn: AnonymousFunctionValue = {
        type: "anonymous-function",
        parameters: ["x", "y"],
        declarationEnvironments: new Environment(),
        body: [
          {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "x"
            },
            right: {
              kind: "Identifier",
              symbol: "y"
            },
            operator: "+"
          }
        ]
      }
      func.callMethod([fn], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("object: " + JSON.stringify({
        type: "anonymous-function",
        params: "x, y"
      }, null, ` `.repeat(4)));
    });

    it("should print a function", () => {
      const func = getNativeFunction("std", "print", env);
      console.log = mock(() => {});
      const fn: FunctionValue = {
        type: "function",
        name: "sum",
        parameters: ["x", "y"],
        declarationEnvironments: new Environment(),
        body: [
          {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "x"
            },
            right: {
              kind: "Identifier",
              symbol: "y"
            },
            operator: "+"
          }
        ]
      }
      func.callMethod([fn], env) as NullValue;

      expect(console.log).toHaveBeenLastCalledWith("object: " + JSON.stringify({
        type: "function",
        name: "sum",
        params: "x, y"
      }, null, ` `.repeat(4)));
    });
  });

  describe("read", () => {
    it("should read an string input", () => {
      const func = getNativeFunction("std", "read", env);
      const spy = spyOn(readObject, "prompt").mockImplementation(() => "hey");
      const result = func.callMethod([STRING("input")], env) as StringValue;

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(STRING("hey"));
    });

    it("should read a number", () => {
      const func = getNativeFunction("std", "read", env);
      const spy = spyOn(readObject, "prompt").mockImplementation(() => "123");
      const result = func.callMethod([STRING("input")], env) as NumberValue;

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(NUMBER(123));
    });

    it("should read a null", () => {
      const func = getNativeFunction("std", "read", env);
      const spy = spyOn(readObject, "prompt").mockImplementation(() => null);
      const result = func.callMethod([STRING("input")], env) as NullValue;

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(NULL());
    });

    it("should throw if no arg is not a string", () => {
      const func = getNativeFunction("std", "read", env);
      expect(() => {
        func.callMethod([NULL()], env);
      }).toThrow();
    });
  });
});
