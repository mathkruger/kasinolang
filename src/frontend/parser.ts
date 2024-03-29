import {
  AnonymousFunctionExpression,
  ArrayIndexExpression,
  ArrayLiteral,
  BinaryExpression,
  CallExpression,
  Expression,
  FunctionDeclaration,
  Identifier,
  IfDeclaration,
  ImportDeclaration,
  MemberExpression,
  NumericLiteral,
  Program,
  Property,
  Statement,
  StringLiteral,
  VariableDeclaration,
  WhileDeclaration,
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
      case TokenType.If:
        return this.parseIfDeclaration();
      case TokenType.While:
        return this.parseWhileDeclaration();
      case TokenType.Import:
        return this.parseImportDeclaration();
      default:
        return this.parseExpression();
    }
  }

  private parseImportDeclaration(): Statement {
    this.eat();

    const path = this.expect(TokenType.String, "The import path should be a string").value;

    const result: ImportDeclaration = {
      kind: "ImportDeclaration",
      path
    };

    return result;
  }

  private parseWhileDeclaration(): Statement {
    this.eat();

    const expression = this.parseExpression();
    const body = this.parseStatementBlock(TokenType.OpenBrace, TokenType.CloseBrace);

    const declaration: WhileDeclaration = {
      kind: "WhileDeclaration",
      expression,
      body
    };

    return declaration;
  }

  private parseIfDeclaration(): Statement {
    this.eat();

    const expression = this.parseExpression();

    const thenStatement: Statement[] = this.parseStatementBlock(TokenType.OpenBrace, TokenType.CloseBrace);
    let elseStatement: Statement[] = [];

    if (this.at().type === TokenType.Else) {
      this.eat();
      elseStatement = this.parseStatementBlock(TokenType.OpenBrace, TokenType.CloseBrace);
    }

    const declaration: IfDeclaration = {
      kind: "IfDeclaration",
      expression,
      thenStatement,
      elseStatement
    };

    return declaration;
  }

  private parseStatementBlock(openToken: TokenType, closeToken: TokenType): Statement[] {
    const statements: Statement[] = [];

    this.expect(openToken, `Open token expected for block`);
    while(this.notEOF() && this.at().type !== closeToken) {
      statements.push(this.parseStatement());
    }
    this.expect(closeToken, "Close token expected for block");

    return statements;
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
      return this.parseComparisonExpression();
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

  private parseComparisonExpression(): Expression {
    let left = this.parseAdditiveExpression();

    while (
      this.at().value === ">" ||
      this.at().value === "<" ||
      this.at().value === "<=" ||
      this.at().value === ">=" ||
      this.at().value === "==" ||
      this.at().value === "&" ||
      this.at().value === "|"
    ) {
      const operator = this.eat().value;
      const right = this.parseAdditiveExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
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
    const member = this.parseArrayIndexExpression();

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

  private parseArrayIndexExpression(): Expression {
    let identifier = this.parseMemberExpression();

    while(this.at().type === TokenType.At) {
      this.eat();
      const index = this.parseMemberExpression();

      if (index.kind !== "NumericLiteral") {
        throw `Parser error: Cannot access array index with ${index.kind}. Use a number value for index!`;
      }

      identifier = {
        kind: "ArrayIndexExpression",
        identifier,
        index
      } as ArrayIndexExpression;
    }

    return identifier;
  }

  private parseMemberExpression(): Expression {
    let object = this.parsePrimaryExpression();

    while (
      this.at().type === TokenType.Dot
    ) {
      this.eat();
      const property = this.parsePrimaryExpression();

      if (property.kind !== "Identifier") {
        throw `Parser error: Cannot use dot operator without right hand side being an identifier.`;
      }

      object = {
        kind: "MemberExpression",
        object,
        property,
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

      case TokenType.OpenBracket: {
        this.eat();
        
        const values: Statement[] = [];
        while(this.notEOF() && this.at().type !== TokenType.CloseBracket) {
          values.push(this.parseStatement());

          if (this.at().type === TokenType.Comma) {
            this.eat();
          }
        }
        this.expect(TokenType.CloseBracket, "Array definition must have a close brace");
        return {
          kind: "ArrayLiteral",
          values
        } as ArrayLiteral;
      }

      default:
        throw `Parser error: Unexpected token found: ${this.at().value}`;
    }
  }
}
