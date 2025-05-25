"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/ui/table";
import { PROSPECT_VALUES } from "@/app/lib/values";
import CompanySearch from "@/app/components/CompanySearch";

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

interface Company {
  _id: string;
  companyName: string;
  approved: boolean;
  industryId: string;
  companyAddress: string;
}

interface Industry {
  _id: string;
  industryName: string;
}

interface ProspectRequestClientProps {
  prospect: Prospect;
  company: Company | null;
  industries: Industry[];
  id: string;
}

export default function ProspectRequestClient({
  prospect,
  company,
  industries,
  id
}: ProspectRequestClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const getStatusLabel = (status: string) => {
    const item = PROSPECT_VALUES.find((item) => item.value === status);
    return item?.label;
  };

  const getIndustryName = (industry_id: string) => {
    const industryName = industries.find((ind) => ind._id === industry_id);
    return industryName?.industryName || "Unknown";
  };

  const approveProspect = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api_new/prospects/update_a_prospect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: prospect._id, newCompay: false, status: "prospect" }),
      });

      const responseForCompanyUpdate = await fetch(`/api_new/companies/update_a_company`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: prospect.company_id,
          approved: true 
        }),
      });

      if (!responseForCompanyUpdate.ok) {
        const error = await responseForCompanyUpdate.json();
        throw new Error(error.error || "Failed to update company status");
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update newCompay status");
      }

      router.push("/dashboard/admin");
    } catch (error) {
      console.error("Error approving prospect:", error);
      alert("Failed to approve prospect. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const declineProspect = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api_new/prospects/delete_a_prospect`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: prospect._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete prospect");
      }
      
      router.push("/dashboard/admin");
    } catch (error) {
      console.error("Error declining prospect:", error);
      alert("Failed to decline prospect. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="container mx-auto p-3">

<div className="flex flex-col items-center w-screen">
  <div className="flex w-full">
    <Button variant="ghost" onClick={() => router.back()} className="mb-1">
      <ArrowLeft className="mr-2 h-4 w-4" />
    </Button>
    <h1 className="text-2xl font-bold mb-6">Prospect Details</h1>
  </div>
  <div className="w-1/2">
    <CompanySearch />
  </div>
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
              <TableCell>{company?.companyAddress}</TableCell>
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
              <TableCell>{getIndustryName(company?.industryId || "")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Product Type</TableCell>
              <TableCell>{prospect.product_type_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>
                {getStatusLabel(prospect.status)}
              </TableCell>
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
            className="mr-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={() => declineProspect()}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Decline"}
          </Button>
          <Button
            className="bg-green-500 text-white hover:bg-green-600 transition-colors"
            onClick={() => approveProspect()}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
}