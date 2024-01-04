import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import { BOOLEAN, NULL, NUMBER } from "./runtime/values";

repl();

function repl() {
  const parser = new Parser();
  const env = new Environment();

  env.declareVariable("true", BOOLEAN(true), true);
  env.declareVariable("false", BOOLEAN(false), true);
  env.declareVariable("null", NULL(), true);

  console.log("\n Kasino Repl 0.1");

  while(true) {
    try {
      const input = prompt("> ");
  
      if (!input || input.includes("exit")) {
        process.exit(0);
      }
  
      const program = parser.produceAST(input);
      const result = evaluate(program, env);
      
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
}