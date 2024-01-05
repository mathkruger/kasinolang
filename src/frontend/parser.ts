import {
  AnonymousFunctionExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  FunctionDeclaration,
  Identifier,
  MemberExpression,
  NumericLiteral,
  Program,
  Property,
  Statement,
  StringLiteral,
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
      throw `Parser error: ${error}\nExpected: ${type}\nActual: ${JSON.stringify(
        previous
      )}`;
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
      case TokenType.Function:
        return this.parseFunctionDeclaration();
      default:
        return this.parseExpression();
    }
  }

  private parseFunctionDeclaration(): Statement {
    this.eat();

    const name = this.expect(
      TokenType.Identifier,
      "Expected a function name folowing fn keyword"
    ).value;

    const args = this.parseArguments();
    const parameters: string[] = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        throw "Parser error: Inside function declaration expected parameters to be of type string."
      }

      parameters.push(arg.symbol);
    }

    this.expect(TokenType.OpenBrace, "Expecetd function body following declaration");

    const body: Statement[] = [];

    while(this.notEOF() && this.at().type !== TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.CloseBrace, "Closing brace expected inside function declaration");
    return {
      kind: "FunctionDeclaration",
      body,
      name,
      parameters
    } as FunctionDeclaration;
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
        value: this.parseExpression(),
      } as VariableDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token on variable declaration"
    );

    const declaration = {
      kind: "VariableDeclaration",
      value: this.parseExpression(),
      constant: isConstant,
      identifier,
    } as VariableDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Expected semicolon on variable declaration"
    );
    return declaration;
  }

  // Expressions
  private parseExpression(): Expression {
    return this.parseAnonymousFunctionExpression();
  }

  private parseAnonymousFunctionExpression(): Expression {
    if (this.at().type !== TokenType.Anon) {
      return this.parseAssignmentExpression();
    }
    
    this.eat();
    this.expect(TokenType.Function, "fn keyword expected for an anonymous function");

    const args = this.parseArguments();
    const parameters: string[] = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        throw "Parser error: Inside function declaration expected parameters to be of type string."
      }

      parameters.push(arg.symbol);
    }

    this.expect(TokenType.OpenBrace, "Expecetd function body following declaration");

    const body: Statement[] = [];

    while(this.notEOF() && this.at().type !== TokenType.CloseBrace) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.CloseBrace, "Closing brace expected inside function declaration");
    return {
      kind: "AnonymousFunctionExpression",
      body,
      parameters
    } as AnonymousFunctionExpression;
  }

  private parseAssignmentExpression(): Expression {
    const left = this.parseObjectExpression();

    if (this.at().type === TokenType.Equals) {
      this.eat();

      const value = this.parseAssignmentExpression();
      return { value, assigne: left, kind: "AssignmentExpression" };
    }

    return left;
  }

  private parseObjectExpression(): Expression {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parseAdditiveExpression();
    }

    this.eat();
    const properties = new Array<Property>();

    while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
      const key = this.expect(
        TokenType.Identifier,
        "Object literal key expected"
      ).value;

      // { key, }
      if (this.at().type === TokenType.Comma) {
        this.eat();

        properties.push({ key, kind: "Property" });
        continue;
      }
      // { key }
      else if (this.at().type === TokenType.CloseBrace) {
        properties.push({ key, kind: "Property" });
        continue;
      }
      // { key: value }
      this.expect(TokenType.Colon, "Missing colon on object literal");
      const value = this.parseExpression();

      properties.push({ key, value, kind: "Property" });
      if (this.at().type !== TokenType.CloseBrace) {
        this.expect(
          TokenType.Comma,
          "Expected comma or closinng brackets followinng property"
        );
      }
    }

    this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");
    return { kind: "ObjectLiteral", properties };
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
    let left = this.parseCallMemberExpression();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.eat().value;
      const right = this.parseCallMemberExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parseCallMemberExpression(): Expression {
    const member = this.parseMemberExpression();

    if (this.at().type === TokenType.OpenParenthesis) {
      return this.parseCallExpression(member);
    }

    return member;
  }

  private parseCallExpression(caller: Expression): CallExpression {
    let callExpression: CallExpression = {
      kind: "CallExpression",
      caller,
      arguments: this.parseArguments(),
    };

    if (this.at().type === TokenType.OpenParenthesis) {
      callExpression = this.parseCallExpression(callExpression);
    }

    return callExpression;
  }

  private parseArguments(): Expression[] {
    this.expect(TokenType.OpenParenthesis, "Expected open parenthesis");
    const args =
      this.at().type === TokenType.CloseParenthesis
        ? []
        : this.parseArgumentsList();

    this.expect(
      TokenType.CloseParenthesis,
      "Missing closing parenthesis inside arguments list"
    );
    return args;
  }

  private parseArgumentsList(): Expression[] {
    const args = [this.parseAssignmentExpression()];

    while (this.at().type === TokenType.Comma && this.eat()) {
      args.push(this.parseAssignmentExpression());
    }

    return args;
  }

  private parseMemberExpression(): Expression {
    let object = this.parsePrimaryExpression();

    while (
      this.at().type === TokenType.Dot ||
      this.at().type === TokenType.OpenBracket
    ) {
      const operator = this.eat();
      let property: Expression;
      let computed: boolean;

      if (operator.type === TokenType.Dot) {
        computed = false;
        property = this.parsePrimaryExpression();

        if (property.kind !== "Identifier") {
          throw `Parser error: Cannot use dot operator without right hand side being an identifier.`;
        }
      } else {
        computed = true;
        property = this.parseExpression();

        this.expect(
          TokenType.CloseBracket,
          "Missing closing bracked in computed value."
        );
      }

      object = {
        kind: "MemberExpression",
        object,
        property,
        computed,
      } as MemberExpression;
    }

    return object;
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

      case TokenType.String:
        return {
          kind: "StringLiteral",
          value: this.eat().value,
        } as StringLiteral;

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
