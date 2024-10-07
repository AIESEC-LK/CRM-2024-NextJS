// src/app/lib/odooRetrieve.ts
const ODOO_API_KEY = process.env.ODOO_API_KEY as string;

interface OdooResponse {
  id: number;
  jsonrpc: string;
  result: Array<{
    name: string;
    email_from: string;
    contact_name: string;
    phone: string;
  }>;
}

export async function odooRetrieve() {
  // Odoo JSON-RPC URL
  const url = "https://bhanu-sunrise-solutions3.odoo.com/jsonrpc";

  // The body for the JSON-RPC request
  const jsonBody = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        "bhanu-sunrise-solutions3", // Database name
        2,                          // User ID (from login)
        ODOO_API_KEY,               // API key from .env
        "crm.lead",                 // The Odoo model to access
        "search_read",              // Method to call
        [[]],                       // Search domain
        {
          fields: ["name", "email_from", "contact_name", "phone"], // Fields to retrieve
          limit: 100                 // Limit the results
        }
      ]
    },
    id: 1
  };

  try {
    // Make the API request to Odoo
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonBody),
    });

    // Parse the JSON response
    const data: OdooResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`Failed to fetch data from Odoo: ${error.message}`);
  }
}
