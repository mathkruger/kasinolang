import Parser from "./frontend/parser";
import { evaluate } from "./runtime/interpreter";

repl();

function repl() {
  const parser = new Parser();
  console.log("\n Kasino Repl 0.1");

  while(true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      process.exit(0);
    }

    const program = parser.produceAST(input);
    const result = evaluate(program);
    
    console.log(result);
  }
}