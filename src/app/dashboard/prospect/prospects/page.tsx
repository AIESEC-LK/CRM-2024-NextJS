"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { useAuth } from "@/app/context/AuthContext";
import { IUserDetails, AuthService } from '@/app/services/authService';

// Define label color schema
const labelColors: { [key: string]: string } = {
  prospect: "bg-orange-400 text-white",
  promoter: "bg-red-500 text-white",
  customer: "bg-indigo-800 text-white",
  entityPartner: "bg-teal-600 text-white",
  lead: "bg-yellow-400 text-white",
  customerPending: "bg-gray-800 text-white",
};

const ProspectsPage = () => {
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>([]);
  const [expandedEntity, setExpandedEntity] = useState<number | null>(null);
  const { user } = useAuth();
  

  // Fetch prospects from the API
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch("/api_new/prospects/get_all_prospects");
        if (!response.ok) {
          throw new Error("Failed to fetch prospects");
        }
        const data = await response.json();
        setProspects(data);
      } catch (error) {
        console.error("Error fetching prospects:", error);
      }
    };


    console.log(user?.lcId)
  
    fetchProspects();
    console.log(prospects)
  }, []);

  const handleRowClick = (id: number) => {
    setExpandedEntity((prev) => (prev === id ? null : id));
    console.log(expandedEntity);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Partnerships</h1>

      <Button
        onClick={() => router.push("/dashboard/prospect/submit_request")}
        className="bg-gray-800 hover:bg-gray-600 text-gray-100 mb-5"
      >
        Create New Prospect
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Events</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
            <TableRow
              key={prospect.id}
              onClick={() => handleRowClick(prospect.id)}
              className="cursor-pointer hover:bg-gray-200"
            >
              <TableCell>{prospect.company_name}</TableCell>

              {/* Check if the status is entityPartner, display merged columns */}
              {prospect.status === "entityPartner" ? (
                <TableCell colSpan={2} className="relative">
                  <div
                    className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                    style={{ backgroundColor: prospect.lc_color }}
                  >
                    {prospect.lc_name}
                    {/* Label for status with dynamic background color */}
                    <span
                      className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status] || 'bg-gray-400 text-white'}`}
                      style={{ zIndex: 10 }}
                    >
                      {prospect.status}
                    </span>
                  </div>
                </TableCell>
              ) : (
                <>
                  <TableCell className="relative">
                    {prospect.product_type_name === "Event" && (
                      <div
                        className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                        style={{ backgroundColor: prospect.lc_color }}
                      >
                        {prospect.lc_name}
                        {/* Label for status with dynamic background color */}
                        <span
                          className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status] || 'bg-gray-400 text-white'}`}
                          style={{ zIndex: 10 }}
                        >
                          {prospect.status}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="relative">
                    {prospect.product_type_name !== "Event" && (
                      <div
                        className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                        style={{ backgroundColor: prospect.lc_color }}
                      >
                        {prospect.lc_name}
                        {/* Label for status with dynamic background color */}
                        <span
                          className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status] || 'bg-gray-400 text-white'}`}
                          style={{ zIndex: 10 }}
                        >
                          {prospect.status}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </>
              )}

              {/* Action buttons */}
              
              {prospect.entity_id ==user?.lcId && (              
                <TableCell>

                <>
                  {prospect.status === "prospect" && (
                    <Button
                      onClick={() => router.push(`/dashboard/prospect/convert_to_a_lead?id=${prospect._id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white"
                    >
                      Convert to Lead
                    </Button>
                  )}
                  {prospect.status === "lead" && (
                    <Button
                      onClick={() => router.push(`/dashboard/prospect/lead_to_customer?id=${prospect._id}`)}
                      className="bg-cyan-800 hover:bg-cyan-700 text-white"
                    >
                      Convert to Customer Pending
                    </Button>
                  )}
                  {prospect.status === "promoter" && (
                    <Button
                      onClick={() => router.push(`/dashboard/prospect/promoter?id=${prospect._id}`)}
                      className="bg-red-800 hover:bg-red-700 text-white"
                    >
                      View Promoter
                    </Button>
                  )}
                  {prospect.status === "customerPending" && (
                    <Button
                      onClick={() => router.push(`/dashboard/prospect/customer_pending?id=${prospect._id}`)}
                      className="bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      View Customer Pending
                    </Button>
                  )}
                  {prospect.status === "customer" && (
                    <Button
                      onClick={() => router.push(`/dashboard/prospect/customer?id=${prospect._id}`)}
                      className="bg-indigo-800 hover:bg-indigo-700 text-white"
                    >
                      View Customer
                    </Button>
                  )}
                </>
              
              </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProspectsPage;