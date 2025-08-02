# EVE Tycoon MCP Server

[![smithery badge](https://smithery.ai/badge/@kongyo2/evetycoon-mcp-server)](https://smithery.ai/server/@kongyo2/evetycoon-mcp-server)

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kongyo2/evetycoon-mcp-server)


<a href="https://glama.ai/mcp/servers/@kongyo2/evetycoon-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@kongyo2/evetycoon-mcp-server/badge" alt="EVE Tycoon MCP Server" />
</a>


A Model Context Protocol (MCP) server that provides access to the EVE Tycoon API for EVE Online market data.

## Overview

This MCP server allows you to interact with the EVE Tycoon API to retrieve market data, price statistics, order books, and historical pricing information for EVE Online items across different regions.

## Features

### Tools

- **get_market_stats**: Get price and volume statistics for an item in a specific region
- **get_market_orders**: Get the current order book for an item type with metadata
- **get_market_history**: Get price history for an item in a region
- **get_regions**: Get list of all EVE Online regions
- **get_market_groups**: Get list of all market groups
- **get_market_group_types**: Get list of item types in a specific market group

### Resources

- **EVE Tycoon API Documentation**: Quick reference for API endpoints and usage

### Prompts

- **market-analysis**: Generate queries to find market data for specific items
- **comprehensive-analysis**: Perform detailed market analysis for items

## Installation

### Installing via Smithery

To install evetycoon-mcp-server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@kongyo2/evetycoon-mcp-server):

```bash
npx -y @smithery/cli install @kongyo2/evetycoon-mcp-server --client claude
```

### Manual Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Development

Run the server in development mode:
```bash
npm run dev
```

### Production

Build and start the server:
```bash
npm run build
npm start
```

### Testing

Run tests:
```bash
npm test
```

## API Endpoints Covered

This MCP server provides access to all documented EVE Tycoon API endpoints:

### Market APIs
- `/v1/market/stats/{regionId}/{typeId}` - Market statistics
- `/v1/market/orders/{typeId}` - Order book data
- `/v1/market/history/{regionId}/{typeId}` - Price history

### Static Data APIs
- `/v1/market/regions` - All regions
- `/v1/market/groups` - All market groups
- `/v1/market/groups/{groupId}/types` - Types in market group

## Configuration

The server connects to the EVE Tycoon API at `https://evetycoon.com/api`. No authentication is required for the public endpoints.

## Rate Limiting

Please respect the `Expires` header returned by the EVE Tycoon API. The server will pass through caching information from the upstream API.

## Examples

### Get Market Stats for PLEX in The Forge
```typescript
// Using the get_market_stats tool
{
  "regionId": 10000002,  // The Forge
  "typeId": 44992        // PLEX
}
```

### Get All Orders for a Specific Item
```typescript
// Using the get_market_orders tool
{
  "typeId": 44992,       // PLEX
  "regionId": 10000002   // Optional: filter by region
}
```

### Get Price History
```typescript
// Using the get_market_history tool
{
  "regionId": 10000002,  // The Forge
  "typeId": 44992        // PLEX
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is an unofficial tool and is not affiliated with CCP Games or EVE Online. EVE Online is a trademark of CCP hf.
