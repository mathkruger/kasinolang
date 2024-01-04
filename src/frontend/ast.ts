export type NodeType =
  // Statements
  | "Program"
  | "VariableDeclaration"

  // Expressions
  | "AssignmentExpression"
  | "MemberExpression"
  | "CallExpression"
  | "BinaryExpression"

  // Literals
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "StringLiteral"
  | "NullLiteral"
  | "Identifier";

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

export type CallExpression = {
  kind: "CallExpression";
  arguments: Expression[];
  caller: Expression;
};

export type MemberExpression = {
  kind: "MemberExpression";
  object: Expression;
  property: Expression;
  computed: boolean;
};

export type Identifier = {
  kind: "Identifier";
  symbol: string;
};

export type NumericLiteral = {
  kind: "NumericLiteral";
  value: number;
};

export type StringLiteral = {
  kind: "StringLiteral";
  value: string;
};

export type Property = {
  kind: "Property",
  key: string,
  value?: Expression
};

export type ObjectLiteral = {
  kind: "ObjectLiteral",
  properties: Property[]
};

export type Statement =
  | Program
  | BinaryExpression
  | Identifier
  | NumericLiteral
  | StringLiteral
  | VariableDeclaration
  | AssignmentExpression
  | Property
  | ObjectLiteral
  | CallExpression
  | MemberExpression;
  
export type Expression = Statement;
