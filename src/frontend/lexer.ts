export enum TokenType {
  Let,
  Const,
  Number,
  Identifier,
  String,
  Equals,
  Semicolon,
  OpenParenthesis,
  CloseParenthesis,
  BinaryOperator,
  EOF
}

const RESERVED_KEYWORD: Record<string, TokenType> = {
  "let": TokenType.Let,
  "const": TokenType.Const,
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
      
      case "=":
        tokens.push(token(code.shift(), TokenType.Equals));
      break;

      case ";":
        tokens.push(token(code.shift(), TokenType.Semicolon));
      break;

      case "+":
      case "-":
      case "/":
      case "*":
      case "%":
        tokens.push(token(code.shift(), TokenType.BinaryOperator));
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
        } else {
          throw `Lexer error: Unrecognized token: ${code[0]}`;
        }
      break;
    }
  }

  tokens.push(token("EndOfFile", TokenType.EOF));

  return tokens;
}
