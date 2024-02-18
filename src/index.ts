import Parser from "./frontend/parser";
import { compile } from "./runtime/compiler/compiler";
import Environment, { createGlobalEnvironent } from "./runtime/interpreter/environment";
import { evaluate } from "./runtime/interpreter/interpreter";

const mode = Bun.argv[2];
const filePath = Bun.argv[3];

if (mode === "interpretation" || mode === "i") {
  if (filePath === undefined) {
    repl();
  } else {
    run(filePath);
  }
} else if (mode === "compilation" || mode === "c") {
  compileCode(filePath);
} else {
  console.error("Usage: kasinocompiler c|i file.kl(optional)");
  process.exit(-1);
}

function repl() {
  console.log("\n Kasino Repl 0.1");

  const env = createGlobalEnvironent();

  while (true) {
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

async function compileCode(filePath: string) {
  const file = await Bun.file(filePath).text();
  try {
    const parser = new Parser();
    const program = parser.produceAST(file);
    const result = compile(program);

    console.log(result);
  } catch (err) {
    console.error(err);
  }
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
