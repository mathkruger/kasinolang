import { expect, jest, describe, test } from "bun:test";
import { NUMBER, STRING, NULL, BOOLEAN, NATIVE_FUNCTION, RuntimeValue, OBJECT, ARRAY } from "../../src/runtime/values";

describe("Runtime", () => {
  describe("NUMBER", () => {
    test("should return a NumberValue with the given number", () => {
      const numberValue = NUMBER(5);
      expect(numberValue).toEqual({ type: "number", value: 5 });
    });
  });

  describe("STRING", () => {
    test("should return a StringValue with the given text", () => {
      const stringValue = STRING("hello");
      expect(stringValue).toEqual({ type: "string", value: "hello" });
    });
  });

  describe("NULL", () => {
    test("should return a NullValue with the value 'null'", () => {
      const nullValue = NULL();
      expect(nullValue).toEqual({ type: "null", value: "null" });
    });
  });

  describe("BOOLEAN", () => {
    test("should return a BooleanValue with the given value", () => {
      const booleanValue = BOOLEAN(true);
      expect(booleanValue).toEqual({ type: "boolean", value: true });
    });
  });

  describe("NATIVE_FUNCTION", () => {
    test("should return a NativeFunctionValue with the given call method", () => {
      const callMethod = jest.fn();
      const nativeFunctionValue = NATIVE_FUNCTION(callMethod);
      expect(nativeFunctionValue).toEqual({ type: "native-function", callMethod });
    });
  });

  describe("OBJECT", () => {
    test("should return an ObjectValue with the given properties", () => {
      const properties = new Map<string, RuntimeValue>([
        ["name", STRING("John")],
        ["age", NUMBER(25)],
      ]);
      const objectValue = OBJECT(properties);
      expect(objectValue).toEqual({ type: "object", properties });
    });
  });

  describe("ARRAY", () => {
    test("should return an ArrayValue with the given values", () => {
      const values = [NUMBER(1), NUMBER(2), NUMBER(3)];
      const arrayValue = ARRAY(values);
      expect(arrayValue).toEqual({ type: "array", values });
    });
  });
});