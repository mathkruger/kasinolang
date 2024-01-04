import Parser from "./frontend/parser";
import Environment, { createGlobalEnvironent } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";

const filePath = Bun.argv[2];

if (filePath === undefined) {
  repl();
} else {
  run(filePath);
}

function repl() {
  console.log("\n Kasino Repl 0.1");

  while(true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      process.exit(0);
    }
    
    console.log(getResult(input));
  }
}

async function run(filePath: string) {
  const file = await Bun.file(filePath).text();
  getResult(file);
}

function getResult(code: string) {
  try {
    const parser = new Parser();
    const env = createGlobalEnvironent();

    const program = parser.produceAST(code);
    return evaluate(program, env);
  } catch (err) {
    console.error(err);
  }
}