export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpression";

export type Program = {
  kind: "Program";
  body: Statement[];
};

export type BinaryExpression = {
  kind: "BinaryExpression";
  left: Expression;
  right: Expression;
  operator: string;
};

export type Identifier = {
  kind: "Identifier";
  symbol: string;
};

export type NumericLiteral = {
  kind: "NumericLiteral";
  value: number;
};

export type NullLiteral = {
  kind: "NullLiteral";
  value: "null";
};

export type Statement = Program | BinaryExpression | Identifier | NumericLiteral | NullLiteral;
export type Expression = Statement;
