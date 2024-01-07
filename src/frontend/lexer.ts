export enum TokenType {
  Let,
  Const,
  Function,
  Anon,
  If,
  Else,
  While,
  Import,
  Number,
  Identifier,
  String,
  Equals,
  Semicolon,
  Colon,
  Comma,
  Dot,
  At,
  OpenParenthesis, // (
  CloseParenthesis, // )
  OpenBrace, // {
  CloseBrace, // }
  OpenBracket, // [
  CloseBracket, // ]
  BinaryOperator,
  EOF
}

const RESERVED_KEYWORD: Record<string, TokenType> = {
  "let": TokenType.Let,
  "const": TokenType.Const,
  "fn": TokenType.Function,
  "anon": TokenType.Anon,
  "if": TokenType.If,
  "else": TokenType.Else,
  "while": TokenType.While,
  "import": TokenType.Import,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(code: string) {
  return code.toUpperCase() !== code.toLocaleLowerCase();
}

function isNumber(code: string) {
  return code >= '0' && code <= '9';
}

function isSkippable(code: string) {
  return code === "\n" || code === "\r" || code === "\t" || code === " ";
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const code = sourceCode.split("");

  while(code.length > 0) {
    switch(code[0]) {
      case "(":
        tokens.push(token(code.shift(), TokenType.OpenParenthesis));
      break;
      
      case ")":
        tokens.push(token(code.shift(), TokenType.CloseParenthesis));
      break;

      case "{":
        tokens.push(token(code.shift(), TokenType.OpenBrace));
      break;
      
      case "}":
        tokens.push(token(code.shift(), TokenType.CloseBrace));
      break;

      case "[":
        tokens.push(token(code.shift(), TokenType.OpenBracket));
      break;
      
      case "]":
        tokens.push(token(code.shift(), TokenType.CloseBracket));
      break;
      
      case "=":
        if (code[1] === "=") {
          code.shift();
          code.shift();
          tokens.push(token("==", TokenType.BinaryOperator));
        } else {
          tokens.push(token(code.shift(), TokenType.Equals));
        }
      break;

      case ";":
        tokens.push(token(code.shift(), TokenType.Semicolon));
      break;

      case ":":
        tokens.push(token(code.shift(), TokenType.Colon));
      break;

      case ",":
        tokens.push(token(code.shift(), TokenType.Comma));
      break;

      case ".":
        tokens.push(token(code.shift(), TokenType.Dot));
      break;

      case "@":
        tokens.push(token(code.shift(), TokenType.At));
      break;

      case "+":
      case "-":
      case "/":
      case "*":
      case "%":
      case ">":
      case "<":
      case "&":
      case "|":
        if (code[1] !== "=") {
          tokens.push(token(code.shift(), TokenType.BinaryOperator));
        } else {
          const operator = code.shift() as string;
          const equals = code.shift() as string;
          tokens.push(token(operator + equals, TokenType.BinaryOperator));
        }
      break;
      
      default:
        if (isNumber(code[0])) {
          let number = "";
          while(code.length > 0 && isNumber(code[0])) {
            number += code.shift();
          }

          tokens.push(token(number, TokenType.Number));
        } else if (isAlpha(code[0])) {
          let identifier = "";

          while(code.length > 0 && isAlpha(code[0])) {
            identifier += code.shift();
          }

          const reserved = RESERVED_KEYWORD[identifier];

          if (typeof reserved === "number") {
            tokens.push(token(identifier, reserved));
          } else {
            tokens.push(token(identifier, TokenType.Identifier));
          }
        } else if (isSkippable(code[0])) {
          code.shift(); 
        } else if (code[0] === "\"") {
          let string = "";

          code.shift();
          while(code[0] !== "\"") {
            string += code.shift() as string;
          }
          code.shift();

          tokens.push(token(string, TokenType.String));
        } else {
          throw `Lexer error: Unrecognized token: ${code[0]}`;
        }
      break;
    }
  }

  tokens.push(token("EndOfFile", TokenType.EOF));

  return tokens;
}
