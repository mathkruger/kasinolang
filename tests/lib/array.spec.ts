import { describe, expect, it } from "bun:test";
import { createGlobalEnvironent } from "../../src/runtime/environment";
import { ARRAY, ArrayValue, FunctionValue, NULL, NUMBER, NullValue, NumberValue, STRING, StringValue } from "../../src/runtime/values";
import { getNativeFunction } from "../helpers/get-native-function";

describe("array", () => {
  const env = createGlobalEnvironent();

  describe("len", () => {
    it("should return the length of an array", () => {
      const func = getNativeFunction("array", "len", env);
      const result = func.callMethod([ARRAY([
        NUMBER(0),
        NUMBER(1)
      ])], env) as NumberValue;

      expect(result.value).toEqual(2);
    });

    it("should return the length of a string", () => {
      const func = getNativeFunction("array", "len", env);
      const result = func.callMethod([STRING("012")], env) as NumberValue;

      expect(result.value).toEqual(3);
    });
  });

  describe("at", () => {
    it("should return the index value of an array", () => {
      const func = getNativeFunction("array", "at", env);
      const result = func.callMethod([ARRAY([
        NUMBER(0),
        NUMBER(1)
      ]), NUMBER(0)], env) as NumberValue;

      expect(result.value).toEqual(0);
    });

    it("should return the index value of a string", () => {
      const func = getNativeFunction("array", "at", env);
      const result = func.callMethod([STRING("012"), NUMBER(0)], env) as StringValue;

      expect(result.value).toEqual("0");
    });

    it("should throw error when index is not a number", () => {
      const func = getNativeFunction("array", "at", env);
      expect(() => {
        func.callMethod([STRING("012"), STRING("0")], env);
      }).toThrow();
    });

    it("should throw error when the value is not a string or array", () => {
      const func = getNativeFunction("array", "at", env);
      expect(() => {
        func.callMethod([NUMBER(1), NUMBER(0)], env);
      }).toThrow();
    });
  });

  describe("map", () => {
    it("should map over an array running user defined function", () => {
      const func = getNativeFunction("array", "map", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["item", "index"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "double",
        body: [
          {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "item"
            },
            right: {
              kind: "NumericLiteral",
              value: 2
            },
            operator: "*"
          }
        ]
      };
      const result = func.callMethod([ARRAY([
        NUMBER(1),
        NUMBER(2),
        NUMBER(3)
      ]), functionValue], env) as ArrayValue;

      expect(result.values).toEqual([
        NUMBER(2),
        NUMBER(4),
        NUMBER(6)
      ]);
    });

    it("should throw error when the first argument is not an array", () => {
      const func = getNativeFunction("array", "map", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["item", "index"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "double",
        body: [
          {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "item"
            },
            right: {
              kind: "NumericLiteral",
              value: 2
            },
            operator: "*"
          }
        ]
      };

      expect(() => {
        func.callMethod([STRING("012"), functionValue], env);
      }).toThrow();
    });

    it("should throw error when the second argument is not a function", () => {
      const func = getNativeFunction("array", "map", env);
      const functionValue: StringValue = STRING("function");

      expect(() => {
        func.callMethod([ARRAY([
          NUMBER(1),
          NUMBER(2),
          NUMBER(3)
        ]), functionValue], env);
      }).toThrow();
    });
  });

  describe("foreach", () => {
    it("should loop over an array running user defined function", () => {
      const func = getNativeFunction("array", "foreach", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["item", "index"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "double",
        body: [
          {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "item"
            },
            right: {
              kind: "NumericLiteral",
              value: 2
            },
            operator: "*"
          }
        ]
      };
      const result = func.callMethod([ARRAY([
        NUMBER(1),
        NUMBER(2),
        NUMBER(3)
      ]), functionValue], env) as NullValue;

      expect(result).toEqual(NULL());
    });

    it("should throw error when the first argument is not an array", () => {
      const func = getNativeFunction("array", "foreach", env);
      const functionValue: FunctionValue = {
        type: "function",
        parameters: ["item", "index"],
        declarationEnvironments: createGlobalEnvironent(),
        name: "double",
        body: [
          {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "item"
            },
            right: {
              kind: "NumericLiteral",
              value: 2
            },
            operator: "*"
          }
        ]
      };

      expect(() => {
        func.callMethod([STRING("012"), functionValue], env);
      }).toThrow();
    });
  });

  describe("push", () => {
    it("should push a value to an array", () => {
      const func = getNativeFunction("array", "push", env);

      const result = func.callMethod([ARRAY([
        NUMBER(1),
        NUMBER(2),
        NUMBER(3)
      ]), NUMBER(4)], env) as ArrayValue;

      expect(result.values).toEqual([
        NUMBER(1),
        NUMBER(2),
        NUMBER(3),
        NUMBER(4),
      ]);
    });

    it("should throw error when the first argument is not an array", () => {
      const func = getNativeFunction("array", "push", env);
      expect(() => {
        func.callMethod([STRING("012"), NUMBER(1)], env);
      }).toThrow();
    });
  });

  describe("pop", () => {
    it("should pop a value from an array", () => {
      const func = getNativeFunction("array", "pop", env);
      const array = ARRAY([
        NUMBER(1),
        NUMBER(2),
        NUMBER(3)
      ]);

      const result = func.callMethod([array], env) as NumberValue;

      expect(result).toEqual(NUMBER(3));
      expect(array.values).toEqual([
        NUMBER(1),
        NUMBER(2),
      ]);
    });

    it("should throw error when the first argument is not an array", () => {
      const func = getNativeFunction("array", "pop", env);
      expect(() => {
        func.callMethod([STRING("012")], env);
      }).toThrow();
    });
  });

  describe("join", () => {
    it("should join an array of strings", () => {
      const func = getNativeFunction("array", "join", env);
      const array = ARRAY([
        STRING("hello"),
        STRING("world!"),
      ]);

      const result = func.callMethod([array, STRING(", ")], env) as StringValue;

      expect(result).toEqual(STRING("hello, world!"));
    });

    it("should throw error when the first argument is not an array", () => {
      const func = getNativeFunction("array", "join", env);
      expect(() => {
        func.callMethod([STRING("012"), STRING(" ")], env);
      }).toThrow();
    });

    it("should throw error when the second argument is not a string", () => {
      const func = getNativeFunction("array", "join", env);
      expect(() => {
        func.callMethod([ARRAY([
          STRING("hello"),
          STRING("world!"),
        ]), NUMBER(1)], env);
      }).toThrow();
    });

    it("should throw error when the first argument is not an array of only strings", () => {
      const func = getNativeFunction("array", "join", env);
      expect(() => {
        func.callMethod([ARRAY([
          NUMBER(1),
          STRING("world!"),
        ]), STRING(" ")], env);
      }).toThrow();
    });
  });
});
