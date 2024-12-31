import { Suspense } from "react";
import ConvertToALeadPage from "./convert_to_a_lead_page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConvertToALeadPage />
    </Suspense>
  );
}
