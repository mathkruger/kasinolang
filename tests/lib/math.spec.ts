import { describe, expect, it } from "bun:test";
import { createGlobalEnvironent } from "../../src/runtime/environment";
import { NULL, NUMBER, NumberValue, StringValue } from "../../src/runtime/values";
import { getNativeFunction } from "../helpers/get-native-function";

describe("math", () => {
  const env = createGlobalEnvironent();

  describe("power", () => {
    it("should return correct power value", () => {
      const func = getNativeFunction("math", "power", env);
      const result = func.callMethod([NUMBER(5), NUMBER(2)], env) as NumberValue;

      expect(result).toEqual(NUMBER(25));
    });

    it("should throw error passing no arguments", () => {
      const func = getNativeFunction("math", "power", env);
      expect(() => {
        func.callMethod([], env);
      }).toThrow();
    });

    it("should throw error if one of the parameters is not a number", () => {
      const func = getNativeFunction("math", "power", env);
      expect(() => {
        func.callMethod([NUMBER(5), NULL()], env);
      }).toThrow();
    });
  });

  describe("nthroot", () => {
    it("should return correct root value", () => {
      const func = getNativeFunction("math", "nthroot", env);
      const result = func.callMethod([NUMBER(9), NUMBER(2)], env) as NumberValue;

      expect(result).toEqual(NUMBER(3));
    });

    it("should throw error passing no arguments", () => {
      const func = getNativeFunction("math", "nthroot", env);
      expect(() => {
        func.callMethod([], env);
      }).toThrow();
    });

    it("should throw error if one of the parameters is not a number", () => {
      const func = getNativeFunction("math", "nthroot", env);
      expect(() => {
        func.callMethod([NUMBER(5), NULL()], env);
      }).toThrow();
    });
  });
});