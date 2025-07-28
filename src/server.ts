import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP({
  name: "EVE Tycoon API",
  version: "1.0.0",
});

const BASE_URL = "https://evetycoon.com/api";

// Helper function to make API requests
async function makeApiRequest(endpoint: string): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Market Stats Tool
server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Get Market Stats",
  },
  description: "Returns price and volume stats for an item type in a specific region",
  execute: async (args) => {
    let endpoint = `/v1/market/stats/${args.regionId}/${args.typeId}`;
    const params = new URLSearchParams();
    
    if (args.systemId) {
      params.append('systemId', args.systemId.toString());
    }
    if (args.locationId) {
      params.append('locationId', args.locationId.toString());
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const data = await makeApiRequest(endpoint);
    return JSON.stringify(data, null, 2);
  },
  name: "get_market_stats",
  parameters: z.object({
    regionId: z.number().describe("Region ID"),
    typeId: z.number().describe("Item type ID"),
    systemId: z.number().optional().describe("System ID to filter on"),
    locationId: z.number().optional().describe("Location ID (station, structure) to filter on"),
  }),
});

// Market Orders Tool
server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Get Market Orders",
  },
  description: "Returns the current order book for an item type, with metadata about the type and locations",
  execute: async (args) => {
    let endpoint = `/v1/market/orders/${args.typeId}`;
    const params = new URLSearchParams();
    
    if (args.regionId) {
      params.append('regionId', args.regionId.toString());
    }
    if (args.systemId) {
      params.append('systemId', args.systemId.toString());
    }
    if (args.locationId) {
      params.append('locationId', args.locationId.toString());
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const data = await makeApiRequest(endpoint);
    return JSON.stringify(data, null, 2);
  },
  name: "get_market_orders",
  parameters: z.object({
    typeId: z.number().describe("Item type ID"),
    regionId: z.number().optional().describe("Region ID to filter on"),
    systemId: z.number().optional().describe("System ID to filter on"),
    locationId: z.number().optional().describe("Location ID (station, structure) to filter on"),
  }),
});

// Market History Tool
server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Get Market History",
  },
  description: "Returns the price history of an item in a particular region",
  execute: async (args) => {
    const endpoint = `/v1/market/history/${args.regionId}/${args.typeId}`;
    const data = await makeApiRequest(endpoint);
    return JSON.stringify(data, null, 2);
  },
  name: "get_market_history",
  parameters: z.object({
    regionId: z.number().describe("Region ID"),
    typeId: z.number().describe("Item type ID"),
  }),
});

// Regions Tool
server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Get Regions",
  },
  description: "Returns the list of all regions",
  execute: async () => {
    const data = await makeApiRequest("/v1/market/regions");
    return JSON.stringify(data, null, 2);
  },
  name: "get_regions",
  parameters: z.object({}),
});

// Market Groups Tool
server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Get Market Groups",
  },
  description: "Returns the list of all market groups",
  execute: async () => {
    const data = await makeApiRequest("/v1/market/groups");
    return JSON.stringify(data, null, 2);
  },
  name: "get_market_groups",
  parameters: z.object({}),
});

// Market Group Types Tool
server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Get Market Group Types",
  },
  description: "Returns the list of types in a market group",
  execute: async (args) => {
    const endpoint = `/v1/market/groups/${args.groupId}/types`;
    const data = await makeApiRequest(endpoint);
    return JSON.stringify(data, null, 2);
  },
  name: "get_market_group_types",
  parameters: z.object({
    groupId: z.number().describe("Market group ID"),
  }),
});

// Add resources for API documentation
server.addResource({
  async load() {
    return {
      text: `EVE Tycoon API Documentation

Base URL: https://evetycoon.com/api

Available Endpoints:
- /v1/market/stats/{regionId}/{typeId} - Get market stats for an item
- /v1/market/orders/{typeId} - Get market orders for an item
- /v1/market/history/{regionId}/{typeId} - Get price history for an item
- /v1/market/regions - Get all regions
- /v1/market/groups - Get all market groups
- /v1/market/groups/{groupId}/types - Get types in a market group

All timestamps are in milliseconds since epoch.
Please respect the Expires header for caching.`,
    };
  },
  mimeType: "text/plain",
  name: "EVE Tycoon API Documentation",
  uri: "evetycoon://docs/api",
});

// Add prompts for common use cases
server.addPrompt({
  arguments: [
    {
      description: "Item name or type ID to search for",
      name: "item",
      required: true,
    },
    {
      description: "Region name or ID (optional)",
      name: "region",
      required: false,
    },
  ],
  description: "Generate a query to find market data for a specific item",
  load: async (args) => {
    return `Find market data for ${args.item}${args.region ? ` in ${args.region}` : ''}. 
    
First, if you need to find the type ID for "${args.item}", use the market groups tools to search for it.
Then use the market stats and orders tools to get current pricing and volume data.
${args.region ? 'Make sure to filter by the specified region.' : 'Consider checking multiple major trade hubs like Jita (The Forge region).'}`;
  },
  name: "market-analysis",
});

server.addPrompt({
  arguments: [
    {
      description: "Item type ID",
      name: "typeId",
      required: true,
    },
    {
      description: "Region ID",
      name: "regionId",
      required: true,
    },
    {
      description: "Number of days to analyze (optional)",
      name: "days",
      required: false,
    },
  ],
  description: "Generate a comprehensive market analysis for an item",
  load: async (args) => {
    return `Perform a comprehensive market analysis for item type ${args.typeId} in region ${args.regionId}.

1. Get current market stats using get_market_stats
2. Get current order book using get_market_orders  
3. Get price history using get_market_history
4. Analyze trends, volumes, and pricing patterns
${args.days ? `Focus on the last ${args.days} days of data.` : 'Look at recent trends and patterns.'}

Provide insights on:
- Current buy/sell spreads
- Volume trends
- Price volatility
- Market depth
- Trading opportunities`;
  },
  name: "comprehensive-analysis",
});

server.start({
  transportType: "stdio",
});

