export async function upload_leads_to_mongo(company_list: { id: string }[]) {
  try {
    for (const company of company_list) {
     /* const modifiedCompany = {
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
            "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret

          },
          body: JSON.stringify(company),
        });

        if (!response.ok) {
          console.error(`Failed to upload company ID ${company.id.toString()}: ${response.statusText}`);
        } else {
          const data = await response.json();
          console.log(`Successfully uploaded company ID ${company.id.toString()}:`, data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error uploading company ID ${company.id}:`, error.message);
        } else {
          console.error(`Error uploading company ID ${company.id}:`, error);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("General error uploading companies:", error.message);
    } else {
      console.error("General error uploading companies:", error);
    }
  }
}
