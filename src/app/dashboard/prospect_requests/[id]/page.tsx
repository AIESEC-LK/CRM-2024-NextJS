import { headers } from 'next/headers';
import ProspectRequestClient from './ProspectRequestClient';
import type { InferGetServerSidePropsType } from 'next'; // for pages router (not app router)


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const baseUrl = process.env.BASE_URL!;

  try {
    const prospectResponse = await fetch(
      `${baseUrl}/api_new/prospects/get_all_prospects/${id}`,
      {
        headers: {
          'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!,
        },
      }
    );
    if (!prospectResponse.ok) throw new Error("Failed to fetch prospect data");
    const prospectData = await prospectResponse.json();

    const industriesResponse = await fetch(`${baseUrl}/api_new/industries/get_all_industries`);
    if (!industriesResponse.ok) throw new Error("Failed to fetch industries");
    const industriesData = await industriesResponse.json();

    let companyData = null;
    if (prospectData?.company_id) {
      const companyResponse = await fetch(
        `${baseUrl}/api_new/companies/get_by_id?company_id=${prospectData.company_id}`,
        {
          headers: {
            'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!,
          },
        }
      );
      if (companyResponse.ok) companyData = await companyResponse.json();
    }

    return (
      <ProspectRequestClient
        prospect={prospectData}
        company={companyData}
        industries={industriesData}
        id={id}
      />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading prospect details. Please try again later.</div>;
  }
}
