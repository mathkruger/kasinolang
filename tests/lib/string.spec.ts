import { describe, expect, it } from "bun:test";
import { createGlobalEnvironent } from "../../src/runtime/environment";
import { BOOLEAN, BooleanValue, NULL, STRING, StringValue } from "../../src/runtime/values";
import { getNativeFunction } from "../helpers/get-native-function";

describe("string", () => {
  const env = createGlobalEnvironent();

  describe("equals", () => {
    it("should return if two strings are equal", () => {
      const func = getNativeFunction("string", "equals", env);
      const result = func.callMethod([STRING("ez"), STRING("ez")], env) as BooleanValue;
  
      expect(result).toEqual(BOOLEAN(true));
    });

    it("should throw if one of the arguments is not a string", () => {
      const func = getNativeFunction("string", "equals", env);
      expect(() => {
        func.callMethod([NULL(), STRING("ez")], env)
      }).toThrow();
    });
  });

  describe("concat", () => {
    it("should return two strings concatenated with a separator", () => {
      const func = getNativeFunction("string", "concat", env);
      const result = func.callMethod([STRING("ez"), STRING(" "), STRING("ez")], env) as StringValue;
  
      expect(result).toEqual(STRING("ez ez"));
    });

    it("should throw if one of the arguments is not a string", () => {
      const func = getNativeFunction("string", "concat", env);
      expect(() => {
        func.callMethod([NULL(), NULL(), STRING("ez")], env)
      }).toThrow();
    });
  });
});