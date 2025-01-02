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
import { Search, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface Request {

   _id: any,
    company_id: any,
    product_type_id: any,
    entity_id: any,
    date_added: string,
    date_expires: string,
    contactPersonName: string,
    contactPersonNumber: string,
    contactPersonEmail: string,
    status: string,
    companyName: string,
    companyAddress: string,
    productName: string,
    entityName: string
}

export default function ProspectQueue() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch pending prospects from API
  const fetchRequests = async () => {
    try {
      const response = await fetch("/api_new/pending_prospects/get_all_pending_prospects");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

const filteredRequests = requests.filter(
  (req) =>
    (req.entity_id && req.entity_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (req.companyName && req.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (req.companyAddress && req.companyAddress.toLowerCase().includes(searchTerm.toLowerCase()))
);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            <TableHead>Address</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Date Expires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request._id}>
              <TableCell>{request.entityName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {request.companyName}
                  <div className="ml-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <span className="text-gray-400 cursor-pointer">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Company Info</span>
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Company Details
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Address: {request.companyAddress}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Contact Person
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Name: {request.contactPersonName}
                              <br />
                              Number: {request.contactPersonNumber}
                              <br />
                              Email: {request.contactPersonEmail}
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TableCell>
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
              <TableCell>{formatDate(request.date_added)}</TableCell>
              <TableCell>{formatDate(request.date_expires)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
