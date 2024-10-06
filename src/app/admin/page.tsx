"use client";

import { useState } from "react";
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
import { Search, CheckCircle, XCircle } from "lucide-react";

const initialRequests = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    request: "Account upgrade",
    status: "pending",
  },
  {
    id: 2,
    user: "Jane Smith",
    email: "jane@example.com",
    request: "Data export",
    status: "pending",
  },
  {
    id: 3,
    user: "Bob Johnson",
    email: "bob@example.com",
    request: "API access",
    status: "pending",
  },
  {
    id: 4,
    user: "Alice Brown",
    email: "alice@example.com",
    request: "Custom integration",
    status: "pending",
  },
  {
    id: 5,
    user: "Charlie Davis",
    email: "charlie@example.com",
    request: "Billing inquiry",
    status: "pending",
  },
];

export default function AdminView() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");

  const handleApprove = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this request?"
    );
    if (confirmed) {
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "approved" } : req
        )
      );
    }
  };

  const handleDecline = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this request?"
    );
    if (confirmed) {
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "declined" } : req
        )
      );
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.request.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        CRM Admin View - User Requests
      </h1>
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
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((req) => (
            <TableRow key={req.id}>
              <TableCell>{req.user}</TableCell>
              <TableCell>{req.email}</TableCell>
              <TableCell>{req.request}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.status === "approved"
                      ? "success"
                      : req.status === "declined"
                      ? "destructive"
                      : "default"
                  }
                >
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(req.id)}
                    disabled={req.status !== "pending"}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecline(req.id)}
                    disabled={req.status !== "pending"}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
