"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/ui/table";

interface Prospect {
  _id: string;
  company_id: string;
  product_type_id: string;
  entity_id: string;
  lc_name: string;
  company_name: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  product_type_name: string;
  status: string;
  date_added: string;
  date_expires: string;
  activities: string[];
  lead_proof_url: string;
}

export default function ProspectDetails({
  params,
}: {
  params: { id: string };
}) {
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = params;

useEffect(() => {
  const fetchProspect = async () => {
    try {
      const response = await fetch(`/api_new/prospects/get_all_prospects/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prospect data");
      }
      const data = await response.json();
      setProspect(data);
    } catch (error) {
      console.error("Error fetching prospect:", error);
      setError("An error occurred while fetching the prospect details.");
    }
  };

  fetchProspect();
}, [id]);


  const handleStatusChange = async (status: string) => {
    if (!prospect || (status !== "approved" && status !== "declined")) {
      return;
    }

    try {
      // Update the status via PATCH request
      const response = await fetch(
      `/api_new/prospects/update_a_prospect/${prospect._id}`, // Ensure this is the correct API endpoint
      {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }), // Send the updated status
      }
      );

      if (!response.ok) {
      const errorData: { message: string } = await response.json(); // Get error details
      throw new Error(
        errorData.message || "Failed to update prospect status"
      );
      }

      // Navigate after successful status change
      router.push("/dashboard/admin");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
      (error as Error).message || "An error occurred while updating the prospect status."
      );
    }
  };

  if (error) {
    return <div>{error}</div>; // Show error message if fetching failed
  }

  if (!prospect) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-3">
      <div className="flex">
        <Button variant="ghost" onClick={() => router.back()} className="mb-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold mb-6">Prospect Details</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Entity</TableCell>
              <TableCell>{prospect.lc_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Company Name</TableCell>
              <TableCell>{prospect.company_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Address</TableCell>
              <TableCell>{prospect.company_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Contact Person</TableCell>
              <TableCell>
                <div>{prospect.contactPersonName}</div>
                <div>{prospect.contactPersonNumber}</div>
                <div>{prospect.contactPersonEmail}</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Industry</TableCell>
              <TableCell>{prospect.company_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Product Type</TableCell>
              <TableCell>{prospect.product_type_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Requested At</TableCell>
              <TableCell>
                {new Date(prospect.date_added).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-end p-4">
          <Button
            className="mr-2 bg-red-500 text-white"
            onClick={() => handleStatusChange("declined")}
          >
            Decline
          </Button>
          <Button
            className="bg-green-500 text-white"
            onClick={() => handleStatusChange("approved")}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
