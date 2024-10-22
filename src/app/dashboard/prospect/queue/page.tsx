"use client";

import { useState, useEffect } from "react";
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
import { Search, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

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
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleApprove = async (id: string) => {
    await updateRequestStatus(id, "approved");
  };

  const handleDecline = async (id: string) => {
    await updateRequestStatus(id, "declined");
  };

  const handleReset = async (id: string) => {
    await updateRequestStatus(id, "pending");
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status: status as Request["status"] } : req
        )
      );
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.producttype.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Entity</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Date Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((req) => (
            <TableRow key={req._id}>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {req.entity}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          {req.entity}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {req.entity || "No additional information available."}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {req.companyName}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-5">
                        <div className="space-y-3">
                          <h5 className="font-medium">Company Address</h5>
                          <p>
                            {req.companyAddress ||
                              "No additional information available."}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-medium">Contact Person</h5>
                          <p>Name : {req.contactPersonName}</p>
                          <p>Number: {req.contactPersonNumber}</p>
                          <p>Email : {req.contactPersonEmail}</p>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>{req.industry}</TableCell>
              <TableCell>{req.producttype}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(req._id)}
                    disabled={req.status !== "pending"}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecline(req._id)}
                    disabled={req.status !== "pending"}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  {req.status !== "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleReset(req._id)}
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
    </div>
  );
}
