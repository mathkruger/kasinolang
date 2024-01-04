import {
  BinaryExpression,
  Expression,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
  VariableDeclaration,
} from "./ast";
import { Token, TokenType, tokenize } from "./lexer";

export default class Parser {
  private tokens: Token[] = [];

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);

    const program: Program = {
      kind: "Program",
      body: new Array<Statement>(),
    };

    while (this.notEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private at(): Token {
    return this.tokens[0];
  }

  private eat(): Token {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, error: string): Token {
    const previous = this.tokens.shift();

    if (!previous || previous.type !== type) {
      throw `Parser error: ${error}\nExpected: ${type}\nActual: ${JSON.stringify(previous)}`;
    }

    return previous;
  }

  private notEOF() {
    return this.at().type !== TokenType.EOF;
  }

  private parseStatement(): Statement {
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVariableDeclaration();
      default:
        return this.parseExpression();
    }
  }

  private parseVariableDeclaration(): Statement {
    const isConstant = this.eat().type === TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "let | const expects an identifier!"
    ).value;

    if (this.at().type === TokenType.Semicolon) {
      this.eat();

      if (isConstant) {
        throw "Parser error: Must assign an value to a constant. No value provided!";
      }

      return {
        kind: "VariableDeclaration",
        identifier,
        constant: false,
        value: this.parseExpression()
      } as VariableDeclaration;
    }

    this.expect(TokenType.Equals, "Expected equals token on variable declaration");

    const declaration = {
      kind: "VariableDeclaration",
      value: this.parseExpression(),
      constant: isConstant,
      identifier
    } as VariableDeclaration;

    this.expect(TokenType.Semicolon, "Expected semicolon on variable declaration");
    return declaration;
  }

  private parseExpression(): Expression {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): Expression {
    const left = this.parseAdditiveExpression();

    if (this.at().type === TokenType.Equals) {
      this.eat();

      const value = this.parseAssignmentExpression();
      return { value, assigne: left, kind: "AssignmentExpression" };
    }

    return left;
  }

  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();

    while (this.at().value === "+" || this.at().value === "-") {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parsePrimaryExpression(): Expression {
    const tokenType = this.at().type;

    switch (tokenType) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case TokenType.OpenParenthesis: {
        this.eat();
        const value = this.parseExpression();
        this.expect(TokenType.CloseParenthesis, "Expected closing parenthesis");
        return value;
      }

      default:
        throw `Parser error: Unexpected token found: ${this.at().value}`;
    }
  }
}
