import { expect, describe, test } from "bun:test";
import { createGlobalEnvironent } from "../../../src/runtime/environment";
import {
  evaluateBinaryExpression,
  evaluateIdentifier,
  evaluateAssignment,
  evaluateMemberExpression,
  evaluateArrayIndexExpression,
  evaluateCallExpression,
} from "../../../src/runtime/evaluate/expressions";
import {
  AnonymousFunctionExpression,
  ArrayIndexExpression,
  ArrayLiteral,
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Identifier,
  MemberExpression,
  ObjectLiteral,
  StringLiteral,
} from "../../../src/frontend/ast";
import { ARRAY, BOOLEAN, NUMBER, NumberValue, OBJECT, STRING } from "../../../src/runtime/values";
import { evaluate } from "../../../src/runtime/interpreter";

describe("Interpreter", () => {
  describe("evaluateBinaryExpression", () => {
    test("should evaluate numeric binary expression", () => {
      const sumBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: "+",
      };

      const subBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: "-",
      };

      const mulBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: "*",
      };

      const divBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 4 },
        right: { kind: "NumericLiteral", value: 2 },
        operator: "/",
      };

      const modBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 4 },
        right: { kind: "NumericLiteral", value: 2 },
        operator: "%",
      };

      const eqBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: "==",
      };

      const bigBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: ">",
      };

      const minBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: "<",
      };

      const bigEqBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: ">=",
      };

      const minEqBinaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 3 },
        operator: "<=",
      };

      const divByZeroPositiveOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: { kind: "NumericLiteral", value: 0 },
        operator: "/",
      };

      const divByZeroNegativeOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: -5 },
        right: { kind: "NumericLiteral", value: 0 },
        operator: "/",
      };

      const env = createGlobalEnvironent();

      const sumResult = evaluate(sumBinaryOperation, env);
      const subResult = evaluate(subBinaryOperation, env);
      const mulResult = evaluate(mulBinaryOperation, env);
      const divResult = evaluate(divBinaryOperation, env);
      const modResult = evaluate(modBinaryOperation, env);
      const eqResult = evaluate(eqBinaryOperation, env);
      const bigResult = evaluate(bigBinaryOperation, env);
      const minResult = evaluate(minBinaryOperation, env);
      const bigEqResult = evaluate(bigEqBinaryOperation, env);
      const minEqResult = evaluate(minEqBinaryOperation, env);
      const divByZeroPositiveResult = evaluate(divByZeroPositiveOperation, env);
      const divByZeroNegativeResult = evaluate(divByZeroNegativeOperation, env);


      expect(sumResult).toEqual(NUMBER(8)); // 5 + 3
      expect(subResult).toEqual(NUMBER(2)); // 5 - 3
      expect(mulResult).toEqual(NUMBER(15)); // 5 * 3
      expect(divResult).toEqual(NUMBER(2)); // 4 * 2
      expect(modResult).toEqual(NUMBER(0)); // 4 % 2
      expect(eqResult).toEqual(BOOLEAN(false)); // 5 == 3
      expect(bigResult).toEqual(BOOLEAN(true)); // 5 > 3
      expect(minResult).toEqual(BOOLEAN(false)); // 5 < 3
      expect(bigEqResult).toEqual(BOOLEAN(true)); // 5 >= 3
      expect(minEqResult).toEqual(BOOLEAN(false)); // 5 <= 3
      expect(divByZeroPositiveResult).toEqual(NUMBER(Number.POSITIVE_INFINITY)); // 5 / 0
      expect(divByZeroNegativeResult).toEqual(NUMBER(Number.NEGATIVE_INFINITY)); // -5 / 0
    });

    test("should evaluate boolean binary expression", () => {
      const binaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: {
          kind: "Identifier",
          symbol: "true",
        },
        right: {
          kind: "Identifier",
          symbol: "false",
        },
        operator: "&",
      };

      const env = createGlobalEnvironent();

      const result = evaluateBinaryExpression(binaryOperation, env);

      expect(result).toEqual(BOOLEAN(false));
    });

    test("should throw error for invalid binary expression", () => {
      const binaryOperation: BinaryExpression = {
        kind: "BinaryExpression",
        left: { kind: "NumericLiteral", value: 5 },
        right: {
          kind: "Identifier",
          symbol: "true",
        },
        operator: "+",
      };

      const env = createGlobalEnvironent();

      expect(() => evaluateBinaryExpression(binaryOperation, env)).toThrow();
    });
  });

  describe("evaluateIdentifier", () => {
    test("should evaluate identifier", () => {
      const astNode: Identifier = { kind: "Identifier", symbol: "x" };
      const env = createGlobalEnvironent();

      env.declareVariable("x", NUMBER(5), false);
      const result = evaluateIdentifier(astNode, env);

      expect(result).toEqual(NUMBER(5));
    });
  });

  describe("evaluateAssignment", () => {
    test("should evaluate assignment expression", () => {
      const node: AssignmentExpression = {
        kind: "AssignmentExpression",
        assigne: { kind: "Identifier", symbol: "x" },
        value: { kind: "NumericLiteral", value: 5 },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("x", NUMBER(), false);

      const result = evaluateAssignment(node, env);

      expect(result).toEqual(NUMBER(5));
      expect(env.lookupVariable("x")).toEqual(NUMBER(5));
    });

    test("should throw error for invalid assignment expression", () => {
      const node: AssignmentExpression = {
        kind: "AssignmentExpression",
        assigne: { kind: "NumericLiteral", value: 5 },
        value: { kind: "NumericLiteral", value: 5 },
      };

      const env = createGlobalEnvironent();

      expect(() => evaluateAssignment(node, env)).toThrow(
        "Interpreter error: Invalid left hand side assignment expression"
      );
    });
  });

  describe("evaluateObjectExpression", () => {
    test("should evaluate object expression", () => {
      const astNode: ObjectLiteral = {
        kind: "ObjectLiteral",
        properties: [
          {
            kind: "Property",
            key: "x",
            value: { kind: "NumericLiteral", value: 5 },
          },
          {
            kind: "Property",
            key: "y",
            value: { kind: "NumericLiteral", value: 10 },
          },
        ],
      };

      const env = createGlobalEnvironent();

      const result = evaluate(astNode, env);

      expect(result).toEqual(
        OBJECT(
          new Map([
            ["x", NUMBER(5)],
            ["y", NUMBER(10)],
          ])
        )
      );
    });
  });

  describe("evaluateMemberExpression", () => {
    test("should evaluate member expression", () => {
      const member: MemberExpression = {
        kind: "MemberExpression",
        object: { kind: "Identifier", symbol: "obj" },
        property: { kind: "Identifier", symbol: "x" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("obj", {
        type: "object",
        properties: new Map([["x", NUMBER(5)]]),
      }, true);

      const result = evaluate(member, env);

      expect(result).toEqual(NUMBER(5));
    });

    test("should throw error for non-object identifier", () => {
      const member: MemberExpression = {
        kind: "MemberExpression",
        object: { kind: "Identifier", symbol: "x" },
        property: { kind: "Identifier", symbol: "y" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("x", NUMBER(5), true);

      expect(() => evaluateMemberExpression(member, env)).toThrow(
        "Interpreter error: Cannot get member from a non-object identifier!"
      );
    });

    test("should throw error for non-existing property", () => {
      const member: MemberExpression = {
        kind: "MemberExpression",
        object: { kind: "Identifier", symbol: "obj" },
        property: { kind: "Identifier", symbol: "y" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("obj", {
        type: "object",
        properties: new Map([["x", NUMBER(5)]]),
      }, true);

      expect(() => evaluateMemberExpression(member, env)).toThrow(
        "Interpreter error: property y does not exists on obj!"
      );
    });
  });

  describe("evaluateArrayIndexExpression", () => {
    test("should evaluate array index expression", () => {
      const arrayIndex: ArrayIndexExpression = {
        kind: "ArrayIndexExpression",
        identifier: { kind: "Identifier", symbol: "arr" },
        index: { kind: "NumericLiteral", value: 1 },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("arr", {
        type: "array",
        values: [
          NUMBER(5),
          NUMBER(10),
        ],
      }, true);

      const result = evaluate(arrayIndex, env);

      expect(result).toEqual(NUMBER(10));
    });

    test("should throw error for non-array identifier", () => {
      const arrayIndex: ArrayIndexExpression = {
        kind: "ArrayIndexExpression",
        identifier: { kind: "Identifier", symbol: "x" },
        index: { kind: "NumericLiteral", value: 1 },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("x", NUMBER(5), true);

      expect(() => evaluateArrayIndexExpression(arrayIndex, env)).toThrow(
        "Interpreter error: Cannot get index from a non-array identifier!"
      );
    });

    test("should throw error for non-number index", () => {
      const arrayIndex: ArrayIndexExpression = {
        kind: "ArrayIndexExpression",
        identifier: { kind: "Identifier", symbol: "arr" },
        index: {
          kind: "Identifier",
          symbol: "true",
        },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("arr", {
        type: "array",
        values: [
          NUMBER(5),
          NUMBER(10),
        ],
      }, true);

      expect(() => evaluateArrayIndexExpression(arrayIndex, env)).toThrow(
        "Interpreter error: Cannot use boolean as a array index, use a number!"
      );
    });

    test("should throw error for out of bounds index", () => {
      const arrayIndex: ArrayIndexExpression = {
        kind: "ArrayIndexExpression",
        identifier: { kind: "Identifier", symbol: "arr" },
        index: { kind: "NumericLiteral", value: 2 },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("arr", {
        type: "array",
        values: [
          NUMBER(5),
          NUMBER(10),
        ],
      }, true);

      expect(() => evaluateArrayIndexExpression(arrayIndex, env)).toThrow(
        "Interpreter error: index 2 out of bounds!"
      );
    });
  });

  describe("evaluateCallExpression", () => {
    test("should evaluate call expression for native function", () => {
      const astNode: CallExpression = {
        kind: "CallExpression",
        arguments: [
          { kind: "NumericLiteral", value: 5 },
          { kind: "NumericLiteral", value: 3 },
        ],
        caller: { kind: "Identifier", symbol: "add" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("add", {
        type: "native-function",
        callMethod: (args, env) => {
          const sum = args.reduce((acc, curr) => acc + (curr as NumberValue).value, 0);
          return NUMBER(sum);
        },
      }, true);

      const result = evaluate(astNode, env);

      expect(result).toEqual(NUMBER(8));
    });

    test("should evaluate call expression for user-defined function", () => {
      const astNode: CallExpression = {
        kind: "CallExpression",
        arguments: [{ kind: "NumericLiteral", value: 5 }],
        caller: { kind: "Identifier", symbol: "double" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("double", {
        type: "function",
        name: "double",
        parameters: ["x"],
        declarationEnvironments: env,
        body: [
          {
            kind: "BinaryExpression",
            left: { kind: "Identifier", symbol: "x" },
            right: { kind: "NumericLiteral", value: 2 },
            operator: "*",
          },
        ],
      }, true);

      const result = evaluateCallExpression(astNode, env);

      expect(result).toEqual(NUMBER(10));
    });

    test("should throw error for non-function caller", () => {
      const astNode: CallExpression = {
        kind: "CallExpression",
        arguments: [],
        caller: { kind: "Identifier", symbol: "x" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("x", NUMBER(5), true);

      expect(() => evaluateCallExpression(astNode, env)).toThrow(
        "Interpreter error: Cannot call value that is not a function"
      );
    });

    test("should throw error for incorrect number of arguments", () => {
      const astNode: CallExpression = {
        kind: "CallExpression",
        arguments: [{ kind: "NumericLiteral", value: 5 }],
        caller: { kind: "Identifier", symbol: "add" },
      };

      const env = createGlobalEnvironent();
      env.declareVariable("add", {
        type: "function",
        name: "add",
        parameters: ["x", "y"],
        declarationEnvironments: env,
        body: [
          {
            kind: "BinaryExpression",
            left: { kind: "Identifier", symbol: "x" },
            right: { kind: "Identifier", symbol: "y" },
            operator: "+",
          },
        ],
      }, true);

      expect(() => evaluateCallExpression(astNode, env)).toThrow();
    });
  });

  describe("evaluateAnonymousFunctionExpression", () => {
    test("should evaluate anonymous function expression", () => {
      const astNode: AnonymousFunctionExpression = {
        kind: "AnonymousFunctionExpression",
        parameters: ["x"],
        body: [
          {
            kind: "BinaryExpression",
            left: { kind: "Identifier", symbol: "x" },
            right: { kind: "NumericLiteral", value: 2 },
            operator: "*",
          },
        ],
      };

      const env = createGlobalEnvironent();

      const result = evaluate(astNode, env);

      expect(result).toEqual({
        type: "anonymous-function",
        parameters: ["x"],
        declarationEnvironments: env,
        body: [
          {
            kind: "BinaryExpression",
            left: { kind: "Identifier", symbol: "x" },
            right: { kind: "NumericLiteral", value: 2 },
            operator: "*",
          },
        ],
      });
    });
  });

  describe("evaluateArray", () => {
    test("should evaluate array", () => {
      const array: ArrayLiteral = {
        kind: "ArrayLiteral",
        values: [
          { kind: "NumericLiteral", value: 5 },
          { kind: "NumericLiteral", value: 10 },
        ],
      };

      const env = createGlobalEnvironent();

      const result = evaluate(array, env);

      expect(result).toEqual(ARRAY([
        NUMBER(5),
        NUMBER(10),
      ]));
    });
  });

  describe("string literal", () => {
    test("should evaluate string literal", () => {
      const string: StringLiteral = {
        kind: "StringLiteral",
        value: "hey",
      };

      const env = createGlobalEnvironent();

      const result = evaluate(string, env);

      expect(result).toEqual(STRING("hey"));
    });
  });
});
