"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";

interface Prospect {
  _id: string;
  entity: string;
  companyName: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  industry: string;
  producttype: string;
  status: string;
  dateAdded: string;
}

export default function ProspectDetails({
  params,
}: {
  params: { id: string };
}) {
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    fetchProspect();
  }, []);

  const fetchProspect = async () => {
    try {
      const response = await fetch(`/api/prospect_requests/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prospect data");
      }
      const data = await response.json();
      setProspect(data);
    } catch (error) {
      console.error("Error fetching prospect:", error);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!prospect || (status !== "approved" && status !== "declined")) {
      return;
    }

    try {
      const response = await fetch(`/api/prospect_requests/${prospect._id}`, {
        method: "PATCH", // Using PATCH to update the status
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }), // Send the updated status
      });

      if (!response.ok) {
        throw new Error("Failed to update prospect status");
      }

      router.push("/dashboard/admin"); // Navigate after status change
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the prospect status.");
    }
  };

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
              <TableCell>{prospect.entity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Company Name</TableCell>
              <TableCell>{prospect.companyName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Address</TableCell>
              <TableCell>{prospect.companyAddress}</TableCell>
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
              <TableCell>{prospect.industry}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Product Type</TableCell>
              <TableCell>{prospect.producttype}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>
                <Badge
                  className={
                    prospect.status === "approved"
                      ? "bg-green-500"
                      : prospect.status === "declined"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }
                >
                  {prospect.status.charAt(0).toUpperCase() +
                    prospect.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Requested At</TableCell>
              <TableCell>
                {new Date(prospect.dateAdded).toLocaleString()}
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell className="font-medium"> Actions </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mb-1 mr-3 bg-green-500 hover:bg-green-700 p-3"
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mb-1 ml-3 bg-red-500 p-3 hover:bg-red-700 "
                >
                  Decline
                </Button>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
        <div className="flex justify-end p-4">
          <>
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
          </>
        </div>
      </div>
    </div>
  );
}
