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
  
  const env = createGlobalEnvironent();

  while(true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      process.exit(0);
    }
    
    const result = getResult(input, env);
    console.log(result);
  }
}

async function run(filePath: string) {
  const file = await Bun.file(filePath).text();
  const env = createGlobalEnvironent();

  getResult(file, env);
}

function getResult(code: string, env: Environment) {
  try {
    const parser = new Parser();
    const program = parser.produceAST(code);
    return evaluate(program, env);
  } catch (err) {
    console.error(err);
  }
}