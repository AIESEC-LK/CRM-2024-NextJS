import ProspectsClient from "./ProspectsClient";

// ✅ Force this page to be dynamically rendered on the server
export const dynamic = "force-dynamic";

export default async function Page() {
  const baseUrl = process.env.BASE_URL;

  try {
    const prospect_response = await fetch(`${baseUrl}api_new/prospects/get_all_prospects`, {
      // Optionally set caching behavior if needed
      headers: {
        "x-internal-auth": process.env.INTERNAL_API_SECRET!,
        cache: "no-store", // Optional: disables fetch caching
      },
    });

    if (!prospect_response.ok) {
      throw new Error(`Failed to fetch prospect data: ${prospect_response.statusText}`);
    }

    const prospect_data = await prospect_response.json();

    return (
      <>
        <ProspectsClient prospect_list={prospect_data} />
      </>
    );
  } catch (error) {
    console.error("Error in fetching data:", error);
    return <div>Error loading prospect data. {String(error)}</div>;
  }
}
