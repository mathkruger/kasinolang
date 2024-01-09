import { expect, describe, test } from "bun:test";
import {
  evaluateProgram,
  evaluateVariableDeclaration,
  evaluateFunctionDeclaration,
  evaluateIfDeclaration,
  evaluateWhileDeclaration,
  evaluateImportDeclaration,
} from "../../../src/runtime/evaluate/statements";
import { FunctionDeclaration, IfDeclaration, ImportDeclaration, Program, VariableDeclaration, WhileDeclaration } from "../../../src/frontend/ast";
import { createGlobalEnvironent } from "../../../src/runtime/environment";
import { getSpyEnvironment } from "../../helpers";

describe("evaluateProgram", () => {
  test("should evaluate a program correctly", () => {
    const program: Program = {
      kind: "Program",
      body: [
        {
          kind: "VariableDeclaration",
          constant: true,
          identifier: "x",
          value: {
            kind: "NumericLiteral",
            value: 5,
          },
        },
        {
          kind: "FunctionDeclaration",
          parameters: [],
          name: "foo",
          body: [
            {
              kind: "VariableDeclaration",
              constant: false,
              identifier: "y",
              value: {
                kind: "BinaryExpression",
                left: {
                  kind: "Identifier",
                  symbol: "x",
                },
                right: {
                  kind: "NumericLiteral",
                  value: 10,
                },
                operator: "+",
              },
            },
          ],
        },
      ],
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateProgram(program, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(2);
    expect(env.declareVariable).toHaveBeenCalledWith(
      "x",
      { type: "number", value: 5 },
      true
    );
    expect(env.declareVariable).toHaveBeenCalledWith(
      "foo",
      {
        type: "function",
        name: "foo",
        parameters: [],
        declarationEnvironments: env,
        body: [
          {
            kind: "VariableDeclaration",
            constant: false,
            identifier: "y",
            value: {
              kind: "BinaryExpression",
              left: {
                kind: "Identifier",
                symbol: "x",
              },
              right: {
                kind: "NumericLiteral",
                value: 10,
              },
              operator: "+",
            },
          },
        ],
      },
      true
    );

    expect(result).toEqual({
      type: "function",
      name: "foo",
      parameters: [],
      declarationEnvironments: realEnv,
      body: [
        {
          kind: "VariableDeclaration",
          constant: false,
          identifier: "y",
          value: {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "x",
            },
            right: {
              kind: "NumericLiteral",
              value: 10,
            },
            operator: "+",
          },
        },
      ],
    });
  });
});

describe("evaluateVariableDeclaration", () => {
  test("should evaluate a variable declaration correctly", () => {
    const declaration: VariableDeclaration = {
      kind: "VariableDeclaration",
      constant: true,
      identifier: "x",
      value: {
        kind: "NumericLiteral",
        value: 5,
      },
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateVariableDeclaration(declaration, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(1);
    expect(env.declareVariable).toHaveBeenCalledWith(
      "x",
      { type: "number", value: 5 },
      true
    );

    expect(result).toEqual({ type: "number", value: 5 });
  });
});

describe("evaluateFunctionDeclaration", () => {
  test("should evaluate a function declaration correctly", () => {
    const declaration: FunctionDeclaration = {
      kind: "FunctionDeclaration",
      parameters: [],
      name: "foo",
      body: [
        {
          kind: "VariableDeclaration",
          constant: false,
          identifier: "y",
          value: {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "x",
            },
            right: {
              kind: "NumericLiteral",
              value: 10,
            },
            operator: "+",
          },
        },
      ],
    };
    
    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateFunctionDeclaration(declaration, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(1);
    expect(env.declareVariable).toHaveBeenCalledWith(
      "foo",
      {
        type: "function",
        name: "foo",
        parameters: [],
        declarationEnvironments: env,
        body: [
          {
            kind: "VariableDeclaration",
            constant: false,
            identifier: "y",
            value: {
              kind: "BinaryExpression",
              left: {
                kind: "Identifier",
                symbol: "x",
              },
              right: {
                kind: "NumericLiteral",
                value: 10,
              },
              operator: "+",
            },
          },
        ],
      },
      true
    );

    expect(result).toEqual({
      type: "function",
      name: "foo",
      parameters: [],
      declarationEnvironments: realEnv,
      body: [
        {
          kind: "VariableDeclaration",
          constant: false,
          identifier: "y",
          value: {
            kind: "BinaryExpression",
            left: {
              kind: "Identifier",
              symbol: "x",
            },
            right: {
              kind: "NumericLiteral",
              value: 10,
            },
            operator: "+",
          },
        },
      ],
    });
  });
});

describe("evaluateIfDeclaration", () => {
  test("should evaluate an if declaration correctly when the condition is true", () => {
    const declaration: IfDeclaration = {
      kind: "IfDeclaration",
      expression: {
        kind: "Identifier",
        symbol: "true"
      },
      thenStatement: [
        {
          kind: "VariableDeclaration",
          constant: true,
          identifier: "x",
          value: {
            kind: "NumericLiteral",
            value: 5,
          },
        },
      ],
      elseStatement: [],
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateIfDeclaration(declaration, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(1);
    expect(env.declareVariable).toHaveBeenCalledWith(
      "x",
      { type: "number", value: 5 },
      true
    );

    expect(result).toEqual({ type: "number", value: 5 });
  });

  test("should evaluate an if declaration correctly when the condition is false", () => {
    const declaration: IfDeclaration = {
      kind: "IfDeclaration",
      expression: {
        kind: "Identifier",
        symbol: "false",
      },
      thenStatement: [],
      elseStatement: [
        {
          kind: "VariableDeclaration",
          constant: true,
          identifier: "x",
          value: {
            kind: "NumericLiteral",
            value: 10,
          },
        },
      ],
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateIfDeclaration(declaration, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(1);
    expect(env.declareVariable).toHaveBeenCalledWith(
      "x",
      { type: "number", value: 10 },
      true
    );

    expect(result).toEqual({ type: "number", value: 10 });
  });
});

describe("evaluateWhileDeclaration", () => {
  test("should evaluate a while declaration correctly when the condition is true", () => {
    const declaration: WhileDeclaration = {
      kind: "WhileDeclaration",
      expression: {
        kind: "Identifier",
        symbol: "true"
      },
      body: [
        {
          kind: "VariableDeclaration",
          constant: true,
          identifier: "x",
          value: {
            kind: "NumericLiteral",
            value: 5,
          },
        },
      ],
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateWhileDeclaration(declaration, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(1);
    expect(env.declareVariable).toHaveBeenCalledWith(
      "x",
      { type: "number", value: 5 },
      true
    );

    expect(result).toEqual({ type: "number", value: 5 });
  });

  test("should evaluate a while declaration correctly when the condition is false", () => {
    const declaration: WhileDeclaration = {
      kind: "WhileDeclaration",
      expression: {
        kind: "Identifier",
        symbol: "false",
      },
      body: [],
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateWhileDeclaration(declaration, realEnv);

    expect(env.declareVariable).not.toHaveBeenCalled();

    expect(result).toEqual({ type: "null", value: "null" });
  });
});

describe("evaluateImportDeclaration", () => {
  test("should evaluate an import declaration correctly", () => {
    const declaration: ImportDeclaration = {
      kind: "ImportDeclaration",
      path: "path/to/file",
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    const result = evaluateImportDeclaration(declaration, realEnv);

    expect(env.declareVariable).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ type: "null", value: "null" });
  });

  test("should throw an error when the file is not found", () => {
    const declaration: ImportDeclaration = {
      kind: "ImportDeclaration",
      path: "nonexistent/file",
    };

    const realEnv = createGlobalEnvironent();
    const env = getSpyEnvironment(realEnv);

    expect(() => evaluateImportDeclaration(declaration, realEnv)).toThrow(
      "Interpreter error: nonexistent/file not found"
    );
  });
});
