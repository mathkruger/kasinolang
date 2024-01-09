import { expect, jest, describe, test, spyOn } from "bun:test";
import { evaluateBinaryExpression, evaluateIdentifier, evaluateAssignment, evaluateObjectExpression, evaluateMemberExpression, evaluateArrayIndexExpression, runUserDefinedFunction, evaluateCallExpression, evaluateAnonymousFunctionExpression, evaluateArray } from "../../../src/runtime/evaluate/expressions";
import { AssignmentExpression, BinaryExpression, Expression, Identifier, NumericLiteral, Statement } from "../../../src/frontend/ast";
import Environment, { createGlobalEnvironent } from "../../../src/runtime/environment";
import { BOOLEAN, NUMBER } from "../../../src/runtime/values";

function getNumericLiteral(n: number): NumericLiteral {
  return {
    kind: "NumericLiteral",
    value: n
  };
}

function getIdentifier(symbol: string): Identifier {
  return {
    kind: "Identifier",
    symbol
  };
}

function getAssigment(identifier: Statement, value: Expression): AssignmentExpression {
  return {
    kind: "AssignmentExpression",
    assigne: identifier,
    value
  }
}

describe("evaluateBinaryExpression", () => {
  test("should evaluate numeric binary expression", () => {
    const binaryOperation: BinaryExpression = {
      kind: "BinaryExpression",
      left: getNumericLiteral(5),
      right: getNumericLiteral(3),
      operator: "+",
    };

    const env = createGlobalEnvironent();
    const result = evaluateBinaryExpression(binaryOperation, env);

    expect(result).toEqual(NUMBER(8));
  });

  test("should evaluate boolean binary expression", () => {
    const binaryOperation: BinaryExpression = {
      kind: "BinaryExpression",
      left: getIdentifier("true"),
      right: getIdentifier("false"),
      operator: "&",
    };
    const env = createGlobalEnvironent();

    const result = evaluateBinaryExpression(binaryOperation, env);

    expect(result).toEqual(BOOLEAN(false));
  });

  test("should throw error for different types", () => {
    const binaryOperation: BinaryExpression = {
      kind: "BinaryExpression",
      left: getNumericLiteral(5),
      right: getIdentifier("true"),
      operator: "+",
    };
    const env = createGlobalEnvironent();

    expect(() => {
      evaluateBinaryExpression(binaryOperation, env);
    }).toThrow("Interpretor error: Cannot evaluate binary expressions between different types");
  });
});

// describe("evaluateIdentifier", () => {
//   test("should return value from environment", () => {
//     const astNode: Identifier = getIdentifier("x");
//     const env: Environment = createGlobalEnvironent();
//     const spyEnv = spyOn(env, "lookupVariable");

//     const result = evaluateIdentifier(astNode, env);

//     expect(result).toEqual(NUMBER(5));
//     expect(spyEnv).toHaveBeenCalledWith("x");
//   });
// });

// describe("evaluateAssignment", () => {
//   test("should assign value to variable", () => {
//     const node = getAssigment(
//       getIdentifier("x"),
//       getNumericLiteral(5)
//     );
//     const env = createGlobalEnvironent();
//     const spyEnv = spyOn(env, "assignVariable");

//     env.declareVariable("x", NUMBER(), false);

//     const result = evaluateAssignment(node, env);

//     expect(result).toEqual(NUMBER(5));
//     expect(spyEnv).toHaveBeenCalledWith("x", NUMBER(5));
//   });

//   test("should throw error for invalid left hand side", () => {
//     const node = getAssigment(
//       getNumericLiteral(0),
//       getNumericLiteral(5)
//     );
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateAssignment(node, env);
//     }).toThrow("Interpreter error: Invalid left hand side assignment expression");
//   });
// });

// describe("evaluateObjectExpression", () => {
//   test("should evaluate object expression", () => {
//     const astNode = {
//       properties: [
//         { key: "x", value: { type: "number", value: 5 } },
//         { key: "y", value: { type: "boolean", value: true } },
//       ],
//     };
//     const env = { lookupVariable: jest.fn().mockReturnValue({ type: "number", value: 10 }) };

//     const result = evaluateObjectExpression(astNode, env);

//     expect(result).toEqual({
//       type: "object",
//       properties: new Map([
//         ["x", { type: "number", value: 5 }],
//         ["y", { type: "boolean", value: true }],
//       ]),
//     });
//     expect(env.lookupVariable).toHaveBeenCalledWith("x");
//   });
// });

// describe("evaluateMemberExpression", () => {
//   test("should get member from object", () => {
//     const member = {
//       object: { type: "object", properties: new Map([["x", { type: "number", value: 5 }]]) },
//       property: { symbol: "x" },
//     };
//     const env = createGlobalEnvironent();

//     const result = evaluateMemberExpression(member, env);

//     expect(result).toEqual({ type: "number", value: 5 });
//   });

//   test("should throw error for non-object identifier", () => {
//     const member = {
//       object: { type: "number", value: 5 },
//       property: { symbol: "x" },
//     };
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateMemberExpression(member, env);
//     }).toThrow("Interpreter error: Cannot get member from a non-object identifier!");
//   });

//   test("should throw error for non-existing property", () => {
//     const member = {
//       object: { type: "object", properties: new Map() },
//       property: { symbol: "x" },
//     };
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateMemberExpression(member, env);
//     }).toThrow("Interpreter error: property x does not exists on undefined!");
//   });
// });

// describe("evaluateArrayIndexExpression", () => {
//   test("should get value from array index", () => {
//     const arrayIndex = {
//       identifier: { type: "array", values: [{ type: "number", value: 5 }] },
//       index: { type: "number", value: 0 },
//     };
//     const env = createGlobalEnvironent();

//     const result = evaluateArrayIndexExpression(arrayIndex, env);

//     expect(result).toEqual({ type: "number", value: 5 });
//   });

//   test("should throw error for non-array identifier", () => {
//     const arrayIndex = {
//       identifier: { type: "number", value: 5 },
//       index: { type: "number", value: 0 },
//     };
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateArrayIndexExpression(arrayIndex, env);
//     }).toThrow("Interpreter error: Cannot get index from a non-array identifier!");
//   });

//   test("should throw error for non-number index", () => {
//     const arrayIndex = {
//       identifier: { type: "array", values: [] },
//       index: { type: "boolean", value: true },
//     };
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateArrayIndexExpression(arrayIndex, env);
//     }).toThrow("Interpreter error: Cannot use boolean as a array index, use a number!");
//   });

//   test("should throw error for out of bounds index", () => {
//     const arrayIndex = {
//       identifier: { type: "array", values: [{ type: "number", value: 5 }] },
//       index: { type: "number", value: 1 },
//     };
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateArrayIndexExpression(arrayIndex, env);
//     }).toThrow("Interpreter error: index 1 out of bounds!");
//   });
// });

// describe("runUserDefinedFunction", () => {
//   test("should run user defined function", () => {
//     const args = [{ type: "number", value: 5 }];
//     const fn = {
//       type: "function",
//       parameters: ["x"],
//       declarationEnvironments: {},
//       body: [{ type: "number", value: 10 }],
//     };

//     const result = runUserDefinedFunction(args, fn);

//     expect(result).toEqual({ type: "number", value: 10 });
//   });

//   test("should throw error for incorrect number of parameters", () => {
//     const args = [{ type: "number", value: 5 }];
//     const fn = {
//       type: "function",
//       parameters: ["x", "y"],
//       declarationEnvironments: {},
//       body: [{ type: "number", value: 10 }],
//     };

//     expect(() => {
//       runUserDefinedFunction(args, fn);
//     }).toThrow("Interpreter error: function expects 2 parameters, received 1");
//   });
// });

// describe("evaluateCallExpression", () => {
//   test("should call native function", () => {
//     const astNode = {
//       arguments: [{ type: "number", value: 5 }],
//       caller: { type: "native-function", callMethod: jest.fn().mockReturnValue({ type: "number", value: 10 }) },
//     };
//     const env = createGlobalEnvironent();

//     const result = evaluateCallExpression(astNode, env);

//     expect(result).toEqual({ type: "number", value: 10 });
//     expect(astNode.caller.callMethod).toHaveBeenCalledWith([{ type: "number", value: 5 }], env);
//   });

//   test("should call user defined function", () => {
//     const astNode = {
//       arguments: [{ type: "number", value: 5 }],
//       caller: {
//         type: "function",
//         parameters: ["x"],
//         declarationEnvironments: {},
//         body: [{ type: "number", value: 10 }],
//       },
//     };
//     const env = createGlobalEnvironent();

//     const result = evaluateCallExpression(astNode, env);

//     expect(result).toEqual({ type: "number", value: 10 });
//   });

//   test("should throw error for non-function caller", () => {
//     const astNode = {
//       arguments: [{ type: "number", value: 5 }],
//       caller: { type: "number", value: 10 },
//     };
//     const env = createGlobalEnvironent();

//     expect(() => {
//       evaluateCallExpression(astNode, env);
//     }).toThrow("Interpreter error: Cannot call value that is not a function");
//   });
// });

// describe("evaluateAnonymousFunctionExpression", () => {
//   test("should evaluate anonymous function expression", () => {
//     const astNode = {
//       parameters: ["x"],
//       body: [{ type: "number", value: 10 }],
//     };
//     const env = createGlobalEnvironent();

//     const result = evaluateAnonymousFunctionExpression(astNode, env);

//     expect(result).toEqual({
//       type: "anonymous-function",
//       parameters: ["x"],
//       declarationEnvironments: {},
//       body: [{ type: "number", value: 10 }],
//     });
//   });
// });

// describe("evaluateArray", () => {
//   test("should evaluate array", () => {
//     const array = {
//       values: [{ type: "number", value: 5 }, { type: "boolean", value: true }],
//     };
//     const env = createGlobalEnvironent();

//     const result = evaluateArray(array, env);

//     expect(result).toEqual({
//       type: "array",
//       values: [{ type: "number", value: 5 }, { type: "boolean", value: true }],
//     });
//   });
// });