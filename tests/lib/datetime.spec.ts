import { describe, expect, it } from "bun:test";
import { createGlobalEnvironent } from "../../src/runtime/environment";
import { StringValue } from "../../src/runtime/values";
import { getNativeFunction } from "../helpers/get-native-function";

describe("datetime", () => {
  const env = createGlobalEnvironent();

  it("should display current datetime", () => {
    const func = getNativeFunction("datetime", "now", env);
    const result = func.callMethod([], env) as StringValue;

    expect(result.value).toContain(new Date().toISOString().split("T")[0]);
  });
});