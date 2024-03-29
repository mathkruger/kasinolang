import { array } from "../../lib/array";
import { datetime } from "../../lib/datetime";
import { math } from "../../lib/math";
import { network } from "../../lib/network";
import { std } from "../../lib/std";
import { string } from "../../lib/string";
import { BOOLEAN, NULL, RuntimeValue } from "./values";

export function createGlobalEnvironent() {
  const env = new Environment();

  env.declareVariable("true", BOOLEAN(true), true);
  env.declareVariable("false", BOOLEAN(false), true);
  env.declareVariable("null", NULL(), true);

  env.declareVariable("std", std(), true);
  env.declareVariable("math", math(), true);
  env.declareVariable("datetime", datetime(), true);
  env.declareVariable("array", array(), true);
  env.declareVariable("network", network(), true);
  env.declareVariable("string", string(), true);

  return env;
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVariable(variableName: string, value: RuntimeValue, constant: boolean): RuntimeValue {
    if (this.variables.has(variableName)) {
      throw `Environment error: Cannot declare ${variableName}, its already defined.`;
    }

    this.variables.set(variableName, value);

    if (constant) {
      this.constants.add(variableName);
    }

    return value;
  }

  public assignVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(variableName);

    if (env.constants.has(variableName)) {
      throw `Environment error: Cannot reassign to ${variableName} as it was declared as a constant!`;
    }

    env.variables.set(variableName, value);
    return value;
  }

  public lookupVariable(variableName: string): RuntimeValue {
    const env = this.resolve(variableName);
    return env.variables.get(variableName) as RuntimeValue;
  }

  public resolve(variableName: string): Environment {
    if (this.variables.has(variableName)) {
      return this;
    }

    if (this.parent === undefined) {
      throw `Environment error: Cannot resolve ${variableName}, it does not exist.`
    }

    return this.parent.resolve(variableName);
  }
}
