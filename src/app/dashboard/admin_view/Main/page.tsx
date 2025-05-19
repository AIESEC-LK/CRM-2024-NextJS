import { Suspense } from "react";
import Main from "./MainComponent"; // Import your Main component

export default function ApproveCustomer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  );
}