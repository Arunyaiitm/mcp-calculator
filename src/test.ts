import { CalculatorAgent } from "./agent.js";

async function test() {
  const agent = new CalculatorAgent("qwen3:4b");
  try {
    await agent.init();
    console.log("\n--- Test: What is 12 * 15? ---");
    const answer = await agent.chat("What is 12 * 15?");
    console.log("Answer:", answer);
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await agent.close();
  }
}

test();
