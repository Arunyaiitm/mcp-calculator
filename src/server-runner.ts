import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createCalculatorServer } from "./server.js";

const server = createCalculatorServer();
const transport = new StdioServerTransport();
await server.connect(transport);
