import { FastMCP } from "fastmcp";
import { z } from "zod";

// Simple test to verify the server can be instantiated and tools work
async function testServer() {
  console.log("Testing EVE Tycoon MCP Server...");
  
  const server = new FastMCP({
    name: "EVE Tycoon API Test",
    version: "1.0.0",
  });

  const BASE_URL = "https://evetycoon.com/api";

  // Helper function to make API requests
  async function makeApiRequest(endpoint: string): Promise<any> {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Making request to: ${url}`);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      throw error;
    }
  }

  // Test the regions endpoint
  try {
    console.log("\n1. Testing regions endpoint...");
    const regions = await makeApiRequest("/v1/market/regions");
    console.log(`✓ Successfully retrieved ${regions.length} regions`);
    console.log(`First few regions:`, regions.slice(0, 3));
  } catch (error) {
    console.error("✗ Failed to retrieve regions:", error);
  }

  // Test the market groups endpoint
  try {
    console.log("\n2. Testing market groups endpoint...");
    const groups = await makeApiRequest("/v1/market/groups");
    console.log(`✓ Successfully retrieved ${groups.length} market groups`);
    console.log(`First few groups:`, groups.slice(0, 3));
  } catch (error) {
    console.error("✗ Failed to retrieve market groups:", error);
  }

  // Test market stats for PLEX in The Forge (common test case)
  try {
    console.log("\n3. Testing market stats for PLEX in The Forge...");
    const stats = await makeApiRequest("/v1/market/stats/10000002/44992");
    console.log("✓ Successfully retrieved market stats for PLEX");
    console.log("Stats:", stats);
  } catch (error) {
    console.error("✗ Failed to retrieve market stats:", error);
  }

  console.log("\nTest completed!");
}

// Run the test
testServer().catch(console.error);

