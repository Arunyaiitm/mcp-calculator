import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import Ollama, { type Message, type Tool, type ToolCall } from "ollama";

export class CalculatorAgent {
  private client: Client;
  private transport: StdioClientTransport;
  private mcpTools: Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> = [];

  constructor(private model: string = "qwen3:4b") {
    this.client = new Client({ name: "calculator-agent", version: "1.0.0" });
    this.transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/server-runner.ts"],
      env: { ...process.env } as Record<string, string>,
    });
  }

  async init(): Promise<void> {
    await this.client.connect(this.transport);
    const { tools } = await this.client.listTools();
    this.mcpTools = tools.map((t) => ({
      name: t.name,
      description: t.description ?? "",
      inputSchema: t.inputSchema as Record<string, unknown>,
    }));
    console.log(`Connected. ${this.mcpTools.length} tools available: ${this.mcpTools.map((t) => t.name).join(", ")}`);
  }

  private toOllamaTools(): Tool[] {
    return this.mcpTools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema as Tool["function"]["parameters"],
      },
    }));
  }

  private async executeToolCall(call: ToolCall): Promise<string> {
    const result = await this.client.callTool({
      name: call.function.name,
      arguments: call.function.arguments as Record<string, string>,
    });
    const content = result.content as Array<{ type: string; text?: string }>;
    const textBlock = content?.find((c) => c.type === "text");
    return textBlock?.text ?? JSON.stringify(result);
  }

  async chat(userMessage: string): Promise<string> {
    const messages: Message[] = [{ role: "user", content: userMessage }];
    const tools = this.toOllamaTools();

    while (true) {
      const response = await Ollama.chat({
        model: this.model,
        messages,
        tools: tools.length > 0 ? tools : undefined,
      });

      const message = response.message;
      messages.push(message);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return message.content ?? "";
      }

      for (const call of message.tool_calls) {
        console.log(`  -> Tool: ${call.function.name}(${JSON.stringify(call.function.arguments)})`);
        const result = await this.executeToolCall(call);
        console.log(`  <- Result: ${result}`);

        messages.push({ role: "tool", content: result, tool_name: call.function.name });
      }
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
