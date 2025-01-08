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
import { PROSPECT_VALUES } from "@/app/lib/values";

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

export default function ProspectDetails({
  params,
}: {
  params: { id: string };
}) {
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
   const [industry, setIndustry] = useState<Industry[]>([]);
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
  
    const fetchIndustry = async () => {
      try {
        const response = await fetch("/api_new/industries/get_all_industries");
        if (!response.ok) {
          throw new Error("Failed to fetch industries");
        }
        const data = await response.json();
        setIndustry(data);
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    };
  
    fetchProspect();
    fetchIndustry();
  }, [id]);
  
  useEffect(() => {
    const fetchCompany = async (company_id: string) => {
      try {
        const response = await fetch(`/api_new/companies/get_by_id?company_id=${company_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company");
        }
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };
  
    if (prospect?.company_id) {
      fetchCompany(prospect.company_id);
    }
  }, [prospect]);
  

  const GetStatusLabel =(status: string) => {

const item = PROSPECT_VALUES.find((item) => item.value === status);

return item?.label

  }

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

  
  const getIndustryName = (industry_id: string) => {
    const industryName = industry.find((ind) => ind._id === industry_id);
    return industryName?.industryName;

  }


  const approveProspect = async () => {


    try {
      const response = await fetch(`/api_new/prospects/update_a_prospect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id:prospect._id, newCompay: false ,status:"prospect"}),
      });

      const responseforcompanyUpdate = await fetch(`/api_new/companies/update_a_company`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: prospect.company_id, // Convert ObjectId to string
          approved: true 
        }),
      });

      if (!responseforcompanyUpdate.ok) {
        const error = await responseforcompanyUpdate.json();
        console.error('Update failed:', error);
      }

      if(!responseforcompanyUpdate.ok){

        const errorData = await responseforcompanyUpdate.json();
        throw new Error(errorData.error || "Failed to update company status");
      }
  
      router.push("/dashboard/admin");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update newCompay status");
      }
      const data = await response.json();
      if (data.success) {
        console.log("newCompay field updated successfully!");
        return { success: true, message: "newCompay field updated successfully!" };
      } else {
        console.warn("No documents were modified:", data.error);
        return { success: false, message: data.error || "No changes made." };
      }

      

     

    } catch (error) {
      console.error("Error updating newCompay:", error);
      return { success: false || "An unknown error occurred." };
    }

  }


  const DeclineAProspect = async () => {

    try {
      const response = await fetch(`/api_new/prospects/delete_a_prospect`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id:prospect._id}),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete prospect");
      }
      const data = await response.json();
      if (data.success) {
        console.log("Prospect deleted successfully!");
      router.push("/dashboard/admin");

        return { success: true, message: "Prospect deleted successfully!" };
      } else {
        console.warn("No documents were deleted:", data.error);
        return { success: false, message: data.error || "No changes made." };
      }
    } catch (error) {
      console.error("Error deleting prospect:", error);
      return { success: false || "An unknown error occurred." };
    }


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
              <TableCell>{getIndustryName(company?.industryId||"")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Product Type</TableCell>
              <TableCell>{prospect.product_type_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
             
              <TableCell>
              {GetStatusLabel(prospect.status)}
            
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
            className="mr-2 bg-red-500 text-white"
            onClick={() => DeclineAProspect()}
          >
            Decline
          </Button>
          <Button
            className="bg-green-500 text-white"
            onClick={() => approveProspect()}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
