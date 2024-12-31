import { Suspense } from "react";
import MakeALeadPage from "./make_a_lead_page";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MakeALeadPage />
    </Suspense>
  );
}
