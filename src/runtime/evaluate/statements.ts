import { Program, VariableDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeValue, NULL } from "../values";

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
