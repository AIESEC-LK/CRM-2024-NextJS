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
import { Search, CheckCircle, XCircle } from "lucide-react";
import ConfirmationModal from "@/app/components/ConfirmationModal";

interface Request {
  _id: string;
  entity: string;
  companyName: string;
  industry: string;
  producttype: string;
  status: "pending" | "approved" | "declined";
}

export default function AdminView() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "approve" | "decline" | null
  >(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

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

  const handleApprove = (id: string) => {
    setCurrentRequestId(id);
    setCurrentAction("approve");
    setIsModalOpen(true);
  };

  const handleDecline = (id: string) => {
    setCurrentRequestId(id);
    setCurrentAction("decline");
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (currentAction && currentRequestId) {
      try {
        const response = await fetch("/api/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentRequestId,
            status: currentAction === "approve" ? "approved" : "declined",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update request");
        }

        await fetchRequests(); // Refresh the requests after update
      } catch (error) {
        console.error("Error updating request:", error);
      }
    }
    setIsModalOpen(false);
    setCurrentAction(null);
    setCurrentRequestId(null);
  };

  const handleReset = async (id: string) => {
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset request");
      }

      await fetchRequests(); // Refresh the requests after update
    } catch (error) {
      console.error("Error resetting request:", error);
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
            <TableHead>Entity</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((req) => (
            <TableRow key={req._id}>
              <TableCell>{req.entity}</TableCell>
              <TableCell>{req.companyName}</TableCell>
              <TableCell>{req.industry}</TableCell>
              <TableCell>{req.producttype}</TableCell>
              <TableCell></TableCell>
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
              {
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
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        action={currentAction!}
      />
    </div>
  );
}
