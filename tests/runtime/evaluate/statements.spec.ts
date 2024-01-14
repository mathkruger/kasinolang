import { expect, describe, test } from "bun:test";
import {
  evaluateIfDeclaration,
  evaluateWhileDeclaration,
} from "../../../src/runtime/evaluate/statements";
import {
  Expression,
  FunctionDeclaration,
  IfDeclaration,
  ImportDeclaration,
  Program,
  Statement,
  VariableDeclaration,
  WhileDeclaration,
} from "../../../src/frontend/ast";
import { createGlobalEnvironent } from "../../../src/runtime/environment";
import { BOOLEAN, NULL, NUMBER } from "../../../src/runtime/values";
import { evaluate } from "../../../src/runtime/interpreter";

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

    const result = evaluate(program, realEnv);

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

    const result = evaluate(declaration, realEnv);
    expect(result).toEqual(NUMBER(5));
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

    const result = evaluate(declaration, realEnv);

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
        symbol: "true",
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

    const result = evaluate(declaration, realEnv);

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

    const result = evaluateIfDeclaration(declaration, realEnv);

    expect(result).toEqual(NUMBER(10));
  });

  test("should throw if expressionn does not returns a boolean", () => {
    const declaration: IfDeclaration = {
      kind: "IfDeclaration",
      expression: {
        kind: "StringLiteral",
        value: "false",
      },
      thenStatement: [],
      elseStatement: [],
    };

    const realEnv = createGlobalEnvironent();

    expect(() => {
      evaluateIfDeclaration(declaration, realEnv)
    }).toThrow();
  });

  test("should return null if else block is empty", () => {
    const declaration: IfDeclaration = {
      kind: "IfDeclaration",
      expression: {
        kind: "Identifier",
        symbol: "false",
      },
      thenStatement: [],
      elseStatement: [],
    };

    const realEnv = createGlobalEnvironent();

    const result = evaluateIfDeclaration(declaration, realEnv);
    expect(result).toEqual(NULL());
  });
});

describe("evaluateWhileDeclaration", () => {
  test("should evaluate a while declaration correctly when the condition is true", () => {
    const declaration: WhileDeclaration = {
      kind: "WhileDeclaration",
      expression: {
        kind: "BinaryExpression",
        left: {
          kind: "Identifier",
          symbol: "x",
        },
        right: {
          kind: "Identifier",
          symbol: "true",
        },
        operator: "==",
      },
      body: [
        {
          kind: "AssignmentExpression",
          assigne: {
            kind: "Identifier",
            symbol: "x",
          },
          value: {
            kind: "Identifier",
            symbol: "false",
          },
        },
        {
          kind: "NumericLiteral",
          value: 5,
        },
      ],
    };

    const realEnv = createGlobalEnvironent();
    realEnv.declareVariable("x", BOOLEAN(true), false);

    const result = evaluate(declaration, realEnv);

    expect(result).toEqual(NUMBER(5));
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
    const result = evaluateWhileDeclaration(declaration, realEnv);

    expect(result).toEqual(NULL());
  });
});

describe("evaluateImportDeclaration", () => {
  test("should evaluate an import declaration correctly", () => {
    const declaration: ImportDeclaration = {
      kind: "ImportDeclaration",
      path: "./tests/mock/import.kl",
    };

    const realEnv = createGlobalEnvironent();

    const result = evaluate(declaration, realEnv);

    expect(result).toEqual(NUMBER(5));
  });

  test("should throw an error when the file is not found", () => {
    const declaration: ImportDeclaration = {
      kind: "ImportDeclaration",
      path: "nonexistent/file",
    };

    const realEnv = createGlobalEnvironent();

    expect(() => evaluate(declaration, realEnv)).toThrow(
      "Interpreter error: nonexistent/file not found"
    );
  });
});

describe("interpreter", () => {
  type NewAST = {
    kind: "NewAST",
    test: Expression
  };

  test("should throw if ast is not recognized", () => {
    const declaration: NewAST = {
      kind: "NewAST",
      test: {
        kind: "StringLiteral",
        value: "Test"
      }
    };

    const realEnv = createGlobalEnvironent();

    expect(() => {
      evaluate(declaration as unknown as Statement, realEnv);
    }).toThrow();
  });
});
