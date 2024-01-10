import { describe, expect, it } from "bun:test";
import Parser from "../../src/frontend/parser";

describe("parser", () => {
  const parser: Parser = new Parser();

  it("should produce correct AST for given program", async () => {
    const program = await Bun.file("./examples/code.kl").text();
    const expectedAST = {
      kind: "Program",
      body: [
        {
          kind: "ImportDeclaration",
          path: "functions.kl",
        },
        {
          kind: "FunctionDeclaration",
          body: [
            {
              kind: "CallExpression",
              caller: {
                kind: "MemberExpression",
                object: {
                  kind: "Identifier",
                  symbol: "operations",
                },
                property: {
                  kind: "Identifier",
                  symbol: "add",
                },
              },
              arguments: [
                {
                  kind: "Identifier",
                  symbol: "number",
                },
                {
                  kind: "Identifier",
                  symbol: "number",
                },
              ],
            },
          ],
          name: "doubleNumber",
          parameters: ["number", "index"],
        },
        {
          kind: "FunctionDeclaration",
          body: [
            {
              kind: "CallExpression",
              caller: {
                kind: "MemberExpression",
                object: {
                  kind: "Identifier",
                  symbol: "std",
                },
                property: {
                  kind: "Identifier",
                  symbol: "print",
                },
              },
              arguments: [
                {
                  kind: "StringLiteral",
                  value: "Number at index",
                },
                {
                  kind: "Identifier",
                  symbol: "index",
                },
                {
                  kind: "StringLiteral",
                  value: ":",
                },
                {
                  kind: "Identifier",
                  symbol: "number",
                },
              ],
            },
          ],
          name: "printNumbers",
          parameters: ["number", "index"],
        },
        {
          kind: "VariableDeclaration",
          value: {
            kind: "ArrayLiteral",
            values: [
              {
                kind: "NumericLiteral",
                value: 1,
              },
              {
                kind: "NumericLiteral",
                value: 2,
              },
              {
                kind: "NumericLiteral",
                value: 3,
              },
              {
                kind: "NumericLiteral",
                value: 4,
              },
            ],
          },
          constant: true,
          identifier: "numbers",
        },
        {
          kind: "VariableDeclaration",
          value: {
            kind: "CallExpression",
            caller: {
              kind: "MemberExpression",
              object: {
                kind: "Identifier",
                symbol: "array",
              },
              property: {
                kind: "Identifier",
                symbol: "map",
              },
            },
            arguments: [
              {
                kind: "Identifier",
                symbol: "numbers",
              },
              {
                kind: "Identifier",
                symbol: "doubleNumber",
              },
            ],
          },
          constant: true,
          identifier: "double",
        },
        {
          kind: "CallExpression",
          caller: {
            kind: "MemberExpression",
            object: {
              kind: "Identifier",
              symbol: "std",
            },
            property: {
              kind: "Identifier",
              symbol: "print",
            },
          },
          arguments: [
            {
              kind: "StringLiteral",
              value: "Numbers after mapping:",
            },
          ],
        },
        {
          kind: "CallExpression",
          caller: {
            kind: "MemberExpression",
            object: {
              kind: "Identifier",
              symbol: "array",
            },
            property: {
              kind: "Identifier",
              symbol: "foreach",
            },
          },
          arguments: [
            {
              kind: "Identifier",
              symbol: "double",
            },
            {
              kind: "Identifier",
              symbol: "printNumbers",
            },
          ],
        },
        {
          kind: "VariableDeclaration",
          value: {
            kind: "StringLiteral",
            value: "heyaaaaaah",
          },
          constant: true,
          identifier: "string",
        },
        {
          kind: "CallExpression",
          caller: {
            kind: "MemberExpression",
            object: {
              kind: "Identifier",
              symbol: "std",
            },
            property: {
              kind: "Identifier",
              symbol: "print",
            },
          },
          arguments: [
            {
              kind: "CallExpression",
              caller: {
                kind: "MemberExpression",
                object: {
                  kind: "Identifier",
                  symbol: "array",
                },
                property: {
                  kind: "Identifier",
                  symbol: "at",
                },
              },
              arguments: [
                {
                  kind: "Identifier",
                  symbol: "string",
                },
                {
                  kind: "NumericLiteral",
                  value: 2,
                },
              ],
            },
          ],
        },
        {
          kind: "CallExpression",
          caller: {
            kind: "MemberExpression",
            object: {
              kind: "Identifier",
              symbol: "std",
            },
            property: {
              kind: "Identifier",
              symbol: "print",
            },
          },
          arguments: [
            {
              kind: "MemberExpression",
              object: {
                kind: "Identifier",
                symbol: "operations",
              },
              property: {
                kind: "Identifier",
                symbol: "info",
              },
            },
          ],
        },
      ],
    };

    const result = parser.produceAST(program);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedAST));
  });
});
