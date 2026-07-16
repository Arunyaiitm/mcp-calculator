import * as readline from "readline";
import { CalculatorAgent } from "./agent.js";

const MODEL = process.env.OLLAMA_MODEL ?? "qwen3:4b";

async function main() {
  console.log("=== MCP Calculator Agent ===");
  console.log(`Model: ${MODEL}`);
  console.log();

  const agent = new CalculatorAgent(MODEL);

  try {
    await agent.init();
  } catch (err) {
    console.error("Failed to connect to MCP server:", err);
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q: string): Promise<string> =>
    new Promise((resolve) => rl.question(q, resolve));

  console.log("Ask me math questions! Type 'quit' to exit.\n");

  while (true) {
    const input = await ask("You: ");
    const trimmed = input.trim();

    if (!trimmed || trimmed === "quit" || trimmed === "exit") {
      console.log("Bye!");
      break;
    }

    try {
      const reply = await agent.chat(trimmed);
      console.log(`Agent: ${reply}\n`);
    } catch (err) {
      console.error("Error:", err instanceof Error ? err.message : err);
    }
  }

  rl.close();
  await agent.close();
}

main();
