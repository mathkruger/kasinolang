import {
  BinaryExpression,
  Expression,
  Identifier,
  NullLiteral,
  NumericLiteral,
  Program,
  Statement,
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
      console.error("Parser error:", error, "\nExpected:", type, "\nActual:", previous);
      process.exit(1);
    }

    return previous;
  }

  private notEOF() {
    return this.at().type !== TokenType.EOF;
  }

  private parseStatement(): Statement {
    return this.parseExpression();
  }

  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }

  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();

    while(this.at().value === "+" || this.at().value === "-") {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator
      } as BinaryExpression;
    }

    return left;
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();

    while(this.at().value === "/" || this.at().value === "*" || this.at().value === "%") {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator
      } as BinaryExpression;
    }

    return left;
  }

  private parsePrimaryExpression(): Expression {
    const tokenType = this.at().type;

    switch (tokenType) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      case TokenType.Null:
        this.eat();
        return { value: this.eat().value } as NullLiteral;

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
        console.error("Unexpected token found:", this.at().value);
        process.exit(1);
    }
  }
}
