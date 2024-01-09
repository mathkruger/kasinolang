import { beforeEach, expect, describe, it } from "bun:test";
import Environment, { createGlobalEnvironent } from "../../src/runtime/environment";
import { RuntimeValue, BOOLEAN } from "../../src/runtime/values";

describe("Environment", () => {
  let env: Environment;

  beforeEach(() => {
    env = createGlobalEnvironent();
  });

  describe("declareVariable", () => {
    it("should declare a variable with the given value and constant flag", () => {
      const variableName = "testVariable";
      const value: RuntimeValue = BOOLEAN(true);
      const constant = true;

      const result = env.declareVariable(variableName, value, constant);

      expect(result).toBe(value);
      expect(env.lookupVariable(variableName)).toBe(value);
    });

    it("should throw an error if the variable is already defined", () => {
      const variableName = "testVariable";
      const value: RuntimeValue = BOOLEAN(true);
      const constant = true;

      env.declareVariable(variableName, value, constant);

      expect(() => {
        env.declareVariable(variableName, value, constant);
      }).toThrow("Environment error: Cannot declare testVariable, its already defined.");
    });
  });

  describe("assignVariable", () => {
    it("should assign a new value to an existing variable", () => {
      const variableName = "testVariable";
      const initialValue: RuntimeValue = BOOLEAN(true);
      const newValue: RuntimeValue = BOOLEAN(false);

      env.declareVariable(variableName, initialValue, false);

      const result = env.assignVariable(variableName, newValue);

      expect(result).toBe(newValue);
      expect(env.lookupVariable(variableName)).toBe(newValue);
    });

    it("should throw an error if the variable is declared as a constant", () => {
      const variableName = "testVariable";
      const initialValue: RuntimeValue = BOOLEAN(true);
      const newValue: RuntimeValue = BOOLEAN(false);

      env.declareVariable(variableName, initialValue, true);

      expect(() => {
        env.assignVariable(variableName, newValue);
      }).toThrow("Environment error: Cannot reassign to testVariable as it was declared as a constant!");
    });
  });

  describe("lookupVariable", () => {
    it("should return the value of an existing variable", () => {
      const variableName = "testVariable";
      const value: RuntimeValue = BOOLEAN(true);

      env.declareVariable(variableName, value, false);

      const result = env.lookupVariable(variableName);

      expect(result).toBe(value);
    });

    it("should throw an error if the variable does not exist", () => {
      const variableName = "testVariable";

      expect(() => {
        env.lookupVariable(variableName);
      }).toThrow("Environment error: Cannot resolve testVariable, it does not exist.");
    });
  });
});