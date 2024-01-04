export type NodeType =
  // Statements
  | "Program"
  | "VariableDeclaration"

  // Expressions
  | "AssignmentExpression"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpression";

export type Program = {
  kind: "Program";
  body: Statement[];
};

export type VariableDeclaration = {
  kind: "VariableDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expression;
};

export type AssignmentExpression = {
  kind: "AssignmentExpression";
  assigne: Expression;
  value: Expression;
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

export type Statement =
  | Program
  | BinaryExpression
  | Identifier
  | NumericLiteral
  | VariableDeclaration
  | AssignmentExpression;
export type Expression = Statement;
