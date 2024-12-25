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

import { Search, CheckCircle, XCircle, Info, Eye } from "lucide-react";
import Link from "next/link";

interface Request {
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

export default function AdminView() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api_new/prospects/get_all_prospects");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.lc_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="text-2xl font-bold mb-6 ml-4">Prospect Requests</h1>
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
            <TableHead>Time Requested</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((req) => (
            <TableRow key={req._id}>
              <TableCell>{formatDate(req.date_added)}</TableCell>
              <TableCell>{req.lc_name}</TableCell>
              <TableCell>
                <div className="flex items-center">{req.company_name}</div>
              </TableCell>
              <TableCell>{""}</TableCell>
              <TableCell>{req.product_type_name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/prospect_requests/${req._id}`}>
                    <Button size="sm" className="bg-gray-400 hover:bg-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
