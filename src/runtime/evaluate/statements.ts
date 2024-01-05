import { FunctionDeclaration, IfDeclaration, Program, Statement, VariableDeclaration, WhileDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeValue, NULL, FunctionValue, BooleanValue } from "../values";

export function evaluateProgram(
  program: Program,
  env: Environment
): RuntimeValue {
  let lastEvaluated: RuntimeValue = NULL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;
}

export function evaluateVariableDeclaration(
  declaration: VariableDeclaration,
  env: Environment
): RuntimeValue {
  const value = declaration.value ? evaluate(declaration.value, env) : NULL();
  return env.declareVariable(declaration.identifier, value, declaration.constant);
}

export function evaluateFunctionDeclaration(
  declaration: FunctionDeclaration,
  env: Environment
): RuntimeValue {
  const fn: FunctionValue = {
    type: "function",
    name: declaration.name,
    parameters: declaration.parameters,
    declarationEnvironments: env,
    body: declaration.body
  };

  return env.declareVariable(declaration.name, fn, true);
}

export function evaluateIfDeclaration(
  declaration: IfDeclaration,
  env: Environment
): RuntimeValue {
  const expression = evaluate(declaration.expression, env);

  if (expression.type !== "boolean") {
    throw `Interpreter error: if condition must be a boolean!`;
  }

  if (expression.value === true) {
    return evaluateBlock(declaration.thenStatement, env);
  }

  if (declaration.elseStatement.length === 0) {
    return NULL();
  }

  return evaluateBlock(declaration.elseStatement, env);
}

export function evaluateWhileDeclaration(
  declaration: WhileDeclaration,
  env: Environment
): RuntimeValue {
  let expression = evaluate(declaration.expression, env);

  if (expression.type !== "boolean") {
    throw `Interpreter error: while condition must be a boolean!`;
  }

  let lastEvaluated = NULL();
  while ((expression as BooleanValue).value === true) {
    lastEvaluated = evaluateBlock(declaration.body, env);
    expression = evaluate(declaration.expression, env);
  }
  return lastEvaluated;
}

function evaluateBlock(statements: Statement[], env: Environment) {
  let last: RuntimeValue = NULL();
    
  statements.forEach(statement => {
    last = evaluate(statement, env);
  });

  return last;
}

