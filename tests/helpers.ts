import { spyOn } from "bun:test";
import Environment from "../src/runtime/environment";

export function getSpyEnvironment(env: Environment) {
  return {
    assignVariable: spyOn(env, "assignVariable"),
    declareVariable: spyOn(env, "declareVariable"),
    lookupVariable: spyOn(env, "lookupVariable"),
    resolve: spyOn(env, "resolve"),
  };
}