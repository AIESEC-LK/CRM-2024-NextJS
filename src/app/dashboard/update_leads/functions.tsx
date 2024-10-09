export async function upload_leads_to_mongo(company_list: any) {
  try {
    // Iterate through each company and send them one by one
    for (const company of company_list) {
      // Add default fields to the current company object and map to the desired key structure
      const modified_company = {
        ID: company.id,
        Name: company.name,
        Email: company.email_from || "",
        Phone: company.phone || "",
        Street: company.street || "",
        Street2: company.street2 || "",
        Zip: company.zip || "",
        product_lc: "",
        product: "",
        event_lc: "",
        event: false,
      };

      console.log(modified_company);

      const base_uri = `http://localhost:3000/api/`;
      console.log(base_uri + `add_company_to_bulk_list`);

      // Send the current modified company to the API
      const response = await fetch(base_uri + `add_company_to_bulk_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modified_company), // Send the company data as JSON
      });

      if (!response.ok) {
        throw new Error(`Failed to upload company ID ${company.id}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Successfully uploaded company ID ${company.id}:`, data);
    }
  } catch (error) {
    console.error("Error uploading companies:", error);
  }
}

