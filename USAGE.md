# EVE Tycoon MCP Server - Usage Guide

## Overview

This MCP server provides comprehensive access to the EVE Tycoon API, allowing you to retrieve market data, pricing statistics, and trading information for EVE Online items across all regions.

## Available Tools

### 1. get_market_stats

Retrieves price and volume statistics for a specific item in a region.

**Parameters:**
- `regionId` (number, required): The region ID to query
- `typeId` (number, required): The item type ID to query
- `systemId` (number, optional): Filter by specific system
- `locationId` (number, optional): Filter by specific location (station/structure)

**Example:**
```json
{
  "regionId": 10000002,
  "typeId": 44992
}
```

**Returns:**
- Buy/sell volume and order counts
- Price averages and thresholds
- Outlier information
- Five percent averages for buy/sell orders

### 2. get_market_orders

Retrieves the complete order book for an item type with metadata.

**Parameters:**
- `typeId` (number, required): The item type ID to query
- `regionId` (number, optional): Filter by specific region
- `systemId` (number, optional): Filter by specific system
- `locationId` (number, optional): Filter by specific location

**Example:**
```json
{
  "typeId": 44992,
  "regionId": 10000002
}
```

**Returns:**
- Complete order book data
- Item type metadata
- System, station, and structure information
- Security status and location names

### 3. get_market_history

Retrieves historical price data for an item in a specific region.

**Parameters:**
- `regionId` (number, required): The region ID to query
- `typeId` (number, required): The item type ID to query

**Example:**
```json
{
  "regionId": 10000002,
  "typeId": 44992
}
```

**Returns:**
- Daily price history
- Volume, average, highest, lowest prices
- Order count information

### 4. get_regions

Retrieves the complete list of all EVE Online regions.

**Parameters:** None

**Returns:**
- Array of all regions with ID and name

### 5. get_market_groups

Retrieves the complete list of all market groups.

**Parameters:** None

**Returns:**
- Array of market groups with metadata
- Group hierarchy information
- Icons and descriptions

### 6. get_market_group_types

Retrieves all item types within a specific market group.

**Parameters:**
- `groupId` (number, required): The market group ID to query

**Example:**
```json
{
  "groupId": 1923
}
```

**Returns:**
- Array of item types in the group
- Type metadata including names and descriptions

## Common Use Cases

### Finding Market Data for an Item

1. First, find the item's type ID using `get_market_groups` and `get_market_group_types`
2. Use `get_market_stats` to get current pricing statistics
3. Use `get_market_orders` to see the current order book
4. Use `get_market_history` to analyze price trends

### Analyzing Trading Opportunities

1. Use `get_market_stats` to compare prices across different regions
2. Use `get_market_orders` to analyze market depth and spreads
3. Use `get_market_history` to identify price trends and volatility

### Regional Market Analysis

1. Use `get_regions` to get all available regions
2. Compare market stats across multiple regions for the same item
3. Identify arbitrage opportunities between regions

## Important Region and Type IDs

### Major Trade Hubs
- **The Forge (Jita)**: 10000002
- **Domain (Amarr)**: 10000043
- **Sinq Laison (Dodixie)**: 10000032
- **Metropolis (Rens)**: 10000042
- **Heimatar (Hek)**: 10000030

### Common Item Types
- **PLEX**: 44992
- **Tritanium**: 34
- **Pyerite**: 35
- **Mexallon**: 36
- **Isogen**: 37
- **Nocxium**: 38
- **Zydrine**: 39
- **Megacyte**: 40

## Rate Limiting and Caching

The EVE Tycoon API includes caching headers that should be respected:

- Market stats update every 5 minutes
- Market orders update every 5 minutes  
- Market history updates once per day
- Static data (regions, groups) rarely changes

Always check the `Expires` header in responses to avoid unnecessary API calls.

## Error Handling

The server will return appropriate error messages for:
- Invalid region or type IDs
- Network connectivity issues
- API rate limiting
- Malformed requests

## Examples

### Get PLEX Market Data in Jita
```json
// Get current stats
{
  "tool": "get_market_stats",
  "parameters": {
    "regionId": 10000002,
    "typeId": 44992
  }
}

// Get order book
{
  "tool": "get_market_orders", 
  "parameters": {
    "typeId": 44992,
    "regionId": 10000002
  }
}

// Get price history
{
  "tool": "get_market_history",
  "parameters": {
    "regionId": 10000002,
    "typeId": 44992
  }
}
```

### Find All Ship Types
```json
// First get market groups to find ship group ID
{
  "tool": "get_market_groups",
  "parameters": {}
}

// Then get types in the ships group (ID 4)
{
  "tool": "get_market_group_types",
  "parameters": {
    "groupId": 4
  }
}
```

## Prompts

The server includes two helpful prompts:

### market-analysis
Generates queries to find market data for specific items by name.

### comprehensive-analysis  
Performs detailed market analysis for items using type and region IDs.

These prompts can help automate common analysis workflows.

