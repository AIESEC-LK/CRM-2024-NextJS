'use client'

import React, { useEffect, useState } from "react";
import { upload_leads_to_mongo } from "./functions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Search, CheckCircle, XCircle, XSquare, Pencil, ArrowUp01, ArrowUp, ArrowUpAz, FileIcon } from "lucide-react";
import ConfirmationModalCompanies from "@/app/components/ConfirmationModalCompanies"; // Import the modal component

// Define the shape of the data you expect to receive
interface Lead {
  zip: string;
  street: string;
  street2:string;
  id: number;
  name: string;
  email_from: string;
  phone: string;
}

export default function UpdateLeads() {
  const [leads, setLeads] = useState<Lead[]>([]); // State to store leads data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status

  const [requests, setRequests] = useState(leads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "save" | "delete" | "edit" |null
  >(null);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setCurrentRequestId(id);
    setCurrentAction("save");
    setIsModalOpen(true);
  };

  const handleDecline = (id: number) => {
    setCurrentRequestId(id);
    setCurrentAction("delete");
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setCurrentRequestId(id);
    setCurrentAction("edit");
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (currentAction === "save" && currentRequestId) {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequestId ? { ...req, status: "Saved" } : req
        )
      );
    } else if (currentAction === "delete" && currentRequestId) {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequestId ? { ...req, status: "Deleted" } : req
        )
      );
    } else if (currentAction === "edit" && currentRequestId) {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequestId ? { ...req, status: "Edited" } : req
        )
      );
    }
    setIsModalOpen(false);
    setCurrentAction(null);
    setCurrentRequestId(null);
  };

  const handleReset = (id: number) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "pending" } : req
      )
    );
  };



  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email_from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Fetch the leads data from the API on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Fetch data from the Next.js API route
        const response = await fetch("/api/load_leads_odoo");
        const data = await response.json();
        setLeads(data.result); // Set the leads data from the API response
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLoading(false);
      }
    };

    fetchLeads(); // Call the function to fetch data when the component mounts
  }, []);

  if (loading) {
    return <p>Loading leads...</p>; // Show loading state
  }

  
  return (
    <>
      <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        CRM Admin View - Odoo Company List
      </h1>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search Leads ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Addresses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <TableRow key={lead.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email_from}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.street}</TableCell>
              
              <TableCell>
                <Badge
                  variant={
                    lead.status === "saved"
                      ? "success"
                      : lead.status === "deleted"
                      ? "destructive"
                      : "default"
                  }
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(lead.id)}
                    disabled={lead.status !== "pending"}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <FileIcon className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEdit(lead.id)}
                    disabled={lead.status !== "pending"}
                    variant="ghost"
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecline(lead.id)}
                    disabled={lead.status !== "pending"}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  {lead.status !== "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleReset(lead.id)}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Modal */}
      <ConfirmationModalCompanies
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        action={currentAction!}
      />
    </div>
    </>
  );
}
