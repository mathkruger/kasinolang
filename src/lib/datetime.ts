import Environment from "../runtime/environment";
import { ObjectValue, NativeFunctionValue, NATIVE_FUNCTION, OBJECT, RuntimeValue, STRING } from "../runtime/values";

function dateTimeFunction(_args: RuntimeValue[], _scope: Environment) {
  return STRING(new Date().toISOString());
}

export function datetime(): ObjectValue {
  const props = new Map<string, NativeFunctionValue>();

  props.set("now", NATIVE_FUNCTION(dateTimeFunction));

  return OBJECT(props);
}