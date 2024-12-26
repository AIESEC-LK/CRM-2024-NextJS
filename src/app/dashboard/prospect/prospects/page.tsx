"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

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
  const [prospects, setProspects] = useState<{ [key: string]: string }[]>([]);

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

    fetchProspects();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospects.map((prospect) => (
          <TableRow key={prospect._id}>
            <TableCell>{prospect.name}</TableCell>
            <TableCell>
              <div className={`label ${labelColors[prospect.status]}`}>
                <span style={{ zIndex: 10 }}>
                  {prospect.status}
                </span>
              </div>
            </TableCell>
            <TableCell>
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
                  className="bg-green-800 hover:bg-green-700 text-white"
                >
                  View Customer Pending
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProspectsPage;