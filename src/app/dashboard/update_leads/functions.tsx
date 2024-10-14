export async function upload_leads_to_mongo(company_list: any) {
  try {
    for (const company of company_list) {/*
      const modifiedCompany = {
        ...company,
        product_lc: "",
        product: "",
        event_lc: "",
        event: false,
      };*/

      console.log("Uploading company:", company);

      const base_uri = `http://localhost:3000/api/`;

      try {
        const response = await fetch(base_uri + `add_company_to_bulk_list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(company),
        });

        if (!response.ok) {
          console.error(`Failed to upload company ID ${company.id}: ${response.statusText}`);
        } else {
          const data = await response.json();
          console.log(`Successfully uploaded company ID ${company.id}:`, data);
        }
      } catch (error) {
        console.error(`Error uploading company ID ${company.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error("General error uploading companies:", error.message);
  }
}