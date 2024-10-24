"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Search } from "lucide-react";

interface Request {
  _id: string;
  entity: string;
  companyName: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  industry: string;
  producttype: string;
  status: "pending" | "approved" | "declined";
}

export default function ProspectQueue() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
    const intervalId = setInterval(() => {
      deleteExpiredRequests();
      fetchRequests(); // Refresh the list of requests
    }, 60000); // Check for expired requests every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/pending_prospects");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const deleteExpiredRequests = async () => {
    try {
      const response = await fetch("/api/pending_prospects", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete expired requests");
      }
      const result = await response.json();
      if (result.deletedCount) {
        console.log(`Deleted ${result.deletedCount} expired requests.`);
      }
    } catch (error) {
      console.error("Error deleting expired requests:", error);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.companyAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto pt-0">
      <h1 className="text-2xl font-bold mb-6 ml-4">Prospect Waiting List</h1>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Entity</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request._id}>
              <TableCell>{request.entity}</TableCell>
              <TableCell>{request.companyName}</TableCell>
              <TableCell>{request.companyAddress}</TableCell>
              <TableCell>{request.contactPersonName}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : request.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
