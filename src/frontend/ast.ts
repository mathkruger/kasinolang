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

export type IfDeclaration = {
  kind: "IfDeclaration";
  expression: Expression;
  thenStatement: Statement[];
  elseStatement: Statement[];
}

export type WhileDeclaration = {
  kind: "WhileDeclaration";
  expression: Expression;
  body: Statement[];
}

export type ImportDeclaration = {
  kind: "ImportDeclaration",
  path: string;
}

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
};

export type ArrayIndexExpression = {
  kind: "ArrayIndexExpression";
  identifier: Expression;
  index: Expression;
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

export type ArrayLiteral = {
  kind: "ArrayLiteral";
  values: Statement[];
}

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
  | ArrayLiteral
  | VariableDeclaration
  | FunctionDeclaration
  | IfDeclaration
  | WhileDeclaration
  | ImportDeclaration
  | AssignmentExpression
  | Property
  | ObjectLiteral
  | CallExpression
  | MemberExpression
  | ArrayIndexExpression
  | AnonymousFunctionExpression;
  
export type Expression = Statement;

export type NodeType = Statement["kind"];
