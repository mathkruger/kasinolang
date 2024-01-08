import { expect, test, describe } from "bun:test";
import { Token, TokenType, tokenize } from "../../src/frontend/lexer";

describe("tokenize", () => {
  test("should tokenize parentheses", () => {
    const sourceCode = "()";
    const expectedTokens: Token[] = [
      { value: "(", type: TokenType.OpenParenthesis },
      { value: ")", type: TokenType.CloseParenthesis },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize braces", () => {
    const sourceCode = "{}";
    const expectedTokens: Token[] = [
      { value: "{", type: TokenType.OpenBrace },
      { value: "}", type: TokenType.CloseBrace },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize brackets", () => {
    const sourceCode = "[]";
    const expectedTokens: Token[] = [
      { value: "[", type: TokenType.OpenBracket },
      { value: "]", type: TokenType.CloseBracket },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize equals", () => {
    const sourceCode = "==";
    const expectedTokens: Token[] = [
      { value: "==", type: TokenType.BinaryOperator },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize semicolon", () => {
    const sourceCode = ";";
    const expectedTokens: Token[] = [
      { value: ";", type: TokenType.Semicolon },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize colon", () => {
    const sourceCode = ":";
    const expectedTokens: Token[] = [
      { value: ":", type: TokenType.Colon },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize comma", () => {
    const sourceCode = ",";
    const expectedTokens: Token[] = [
      { value: ",", type: TokenType.Comma },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize dot", () => {
    const sourceCode = ".";
    const expectedTokens: Token[] = [
      { value: ".", type: TokenType.Dot },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize at", () => {
    const sourceCode = "@";
    const expectedTokens: Token[] = [
      { value: "@", type: TokenType.At },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize binary operators", () => {
    const sourceCode = "+-/*%><&|";
    const expectedTokens: Token[] = [
      { value: "+", type: TokenType.BinaryOperator },
      { value: "-", type: TokenType.BinaryOperator },
      { value: "/", type: TokenType.BinaryOperator },
      { value: "*", type: TokenType.BinaryOperator },
      { value: "%", type: TokenType.BinaryOperator },
      { value: ">", type: TokenType.BinaryOperator },
      { value: "<", type: TokenType.BinaryOperator },
      { value: "&", type: TokenType.BinaryOperator },
      { value: "|", type: TokenType.BinaryOperator },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize numbers", () => {
    const sourceCode = "123";
    const expectedTokens: Token[] = [
      { value: "123", type: TokenType.Number },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize identifiers", () => {
    const sourceCode = "let x";
    const expectedTokens: Token[] = [
      { value: "let", type: TokenType.Let },
      { value: "x", type: TokenType.Identifier },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize reserved keywords", () => {
    const sourceCode = "let const fn anon if else while import";
    const expectedTokens: Token[] = [
      { value: "let", type: TokenType.Let },
      { value: "const", type: TokenType.Const },
      { value: "fn", type: TokenType.Function },
      { value: "anon", type: TokenType.Anon },
      { value: "if", type: TokenType.If },
      { value: "else", type: TokenType.Else },
      { value: "while", type: TokenType.While },
      { value: "import", type: TokenType.Import },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should tokenize strings", () => {
    const sourceCode = '"Hello, World!"';
    const expectedTokens: Token[] = [
      { value: "Hello, World!", type: TokenType.String },
      { value: "EndOfFile", type: TokenType.EOF },
    ];

    expect(tokenize(sourceCode)).toEqual(expectedTokens);
  });

  test("should throw error for unrecognized tokens", () => {
    const sourceCode = "$";
    expect(() => tokenize(sourceCode)).toThrow("Lexer error: Unrecognized token: $");
  });
});