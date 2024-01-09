import Environment from "../../src/runtime/environment";
import { ObjectValue, NativeFunctionValue } from "../../src/runtime/values";

export function getNativeFunction(objName: string, name: string, env: Environment) {
  const obj = env.lookupVariable(objName) as ObjectValue;
  const func = obj.properties.get(name) as NativeFunctionValue;

  return func;
}