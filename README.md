# MCP Calculator Agent

A simple calculator powered by the Model Context Protocol (MCP) and Ollama. Ask math questions in plain English and get answers.

## What is this?

This project connects an AI model (Ollama) to a set of calculator tools via MCP. The AI understands your question, picks the right tool, and returns the result — all through a simple chat interface.

## How it works

```
You  ──>  Agent  ──>  Ollama (AI)  ──>  MCP Server (tools)
              │             │                    │
              │  send msg   │  pick tool call    │  execute math
              │<────────────│<───────────────────│
              │  get answer │  return result     │
              │<────────────│<───────────────────│
```

- **MCP Server** — exposes 6 calculator tools (add, subtract, multiply, divide, power, sqrt)
- **Agent** — middleman that connects Ollama to the MCP server and runs the chat loop
- **Ollama** — the AI brain that reads your question and decides which tool to use

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Ollama](https://ollama.com) installed and running

```bash
# Pull a model
ollama pull qwen3:4b
```

## Setup

```bash
# Install dependencies
npm install
```

## Run

```bash
# Interactive chat
npm run dev
```

Then ask things like:

```
What is 12 * 15?
What's the square root of 144?
Calculate (3 + 7) * 2
What is 2 to the power of 10?
```

Type `quit` or `exit` to stop.

## Available Tools

| Tool | Description | Example |
|---|---|---|
| `add` | Add two numbers | 3 + 5 |
| `subtract` | Subtract second from first | 10 - 4 |
| `multiply` | Multiply two numbers | 6 * 7 |
| `divide` | Divide first by second | 20 / 4 |
| `power` | Raise number to a power | 2^8 |
| `sqrt` | Square root of a number | sqrt(144) |

## Use a different model

Set the `OLLAMA_MODEL` environment variable:

```bash
OLLAMA_MODEL=qwen2.5-coder:3b npm run dev
```

## Integrate with OpenCode

Add this to `opencode.jsonc` in your project root:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "calculator": {
      "type": "local",
      "command": ["npx", "tsx", "src/server-runner.ts"],
      "cwd": "."
    }
  }
}
```

## Project structure

```
mcp-calculator/
├── src/
│   ├── server.ts         # MCP server with calculator tools
│   ├── server-runner.ts  # Entry point for the MCP server
│   ├── agent.ts          # Agent connecting Ollama to MCP
│   ├── index.ts          # Interactive REPL
│   └── test.ts           # Quick end-to-end test
├── package.json
└── tsconfig.json
```

## License

MIT
