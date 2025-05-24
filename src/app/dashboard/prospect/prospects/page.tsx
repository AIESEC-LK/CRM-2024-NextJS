import ProspectsClient from "./ProspectsClient";


export default async function Page() {
  const baseUrl = process.env.BASE_URL || 'https://localhost:3000/'; // adjust for prod

  try {
    const prospect_response = await fetch(`${baseUrl}api_new/prospects/get_all_prospects/`);
    if (!prospect_response.ok) {
      throw new Error(`Failed to fetch prospect data: ${prospect_response.statusText}`);
    }
    const prospect_data = await prospect_response.json();

    return <>
      <p>{prospect_data}</p>
      </>;
  } catch (error) {
    console.error("Error in fetching data:", error);
    return <div>Error loading prospect data. Please try again later.</div>;
  }
}
