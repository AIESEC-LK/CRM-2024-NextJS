"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

const ProspectsPage = () => {
  const router = useRouter();
  const [prospects, setProspects] = useState([]);
  const [expandedEntity, setExpandedEntity] = useState<number | null>(null);

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

  const handleRowClick = (id: number) => {
    setExpandedEntity((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Partnerships</h1>

      <Button
        onClick={() => router.push("/dashboard/prospect/submit_request")}
        className="bg-blue-500 hover:bg-blue-600 text-gray-100 mb-5"
      >
        Create New Prospect
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Events</TableHead>
            <TableHead>Products</TableHead>
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
              <TableCell className="relative">
                {prospect.product_type_name === "Event" && (
                  <div
                    className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                    style={{ backgroundColor: prospect.lc_color }}
                  >
                    {prospect.lc_name}
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
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProspectsPage;
