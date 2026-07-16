import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createCalculatorServer(): McpServer {
  const server = new McpServer({
    name: "calculator",
    version: "1.0.0",
  });

  server.tool("add", "Add two numbers together", {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }));

  server.tool("subtract", "Subtract second number from first", {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a - b) }],
  }));

  server.tool("multiply", "Multiply two numbers", {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a * b) }],
  }));

  server.tool("divide", "Divide first number by second", {
    a: z.number().describe("Numerator"),
    b: z.number().describe("Denominator"),
  }, async ({ a, b }) => {
    if (b === 0) {
      return { content: [{ type: "text", text: "Error: Division by zero" }] };
    }
    return { content: [{ type: "text", text: String(a / b) }] };
  });

  server.tool("power", "Raise a number to a power", {
    base: z.number().describe("Base number"),
    exponent: z.number().describe("Exponent"),
  }, async ({ base, exponent }) => ({
    content: [{ type: "text", text: String(Math.pow(base, exponent)) }],
  }));

  server.tool("sqrt", "Calculate square root of a number", {
    a: z.number().describe("Number to find square root of"),
  }, async ({ a }) => {
    if (a < 0) {
      return { content: [{ type: "text", text: "Error: Cannot take square root of negative number" }] };
    }
    return { content: [{ type: "text", text: String(Math.sqrt(a)) }] };
  });

  return server;
}
