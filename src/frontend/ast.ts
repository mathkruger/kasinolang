export type NodeType =
  // Statements
  | "Program"
  | "VariableDeclaration"
  | "FunctionDeclaration"

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

export type FunctionDeclaration = {
  kind: "FunctionDeclaration";
  parameters: string[];
  name: string;
  body: Statement[]
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
  property: Identifier;
  computed: boolean;
};

export type AnonymousFunctionExpression = {
  kind: "AnonymousFunctionExpression";
  parameters: string[];
  body: Statement[]
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
  | FunctionDeclaration
  | AssignmentExpression
  | Property
  | ObjectLiteral
  | CallExpression
  | MemberExpression
  | AnonymousFunctionExpression;
  
export type Expression = Statement;
