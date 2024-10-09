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
import { Search, CheckCircle, XCircle, EyeIcon } from "lucide-react";
import ConfirmationModal from "@/app/components/ConfirmationModal"; // Import the modal component

const initialRequests = [
  {
    id: 1,
    entity: "USJ",
    companyName: "A",
    industry: "NGO",
    producttype: "IGTa",
    status: "pending",
  },
  {
    id: 2,
    entity: "CN",
    companyName: "A",
    industry: "Tourism",
    producttype: "IGTe",
    status: "pending",
  },
  {
    id: 3,
    entity: "CS",
    companyName: "A",
    industry: "Construction",
    producttype: "OGV",
    status: "pending",
  },
  {
    id: 4,
    entity: "SLIIT",
    companyName: "A",
    industry: "Health Services",
    producttype: "OGV",
    status: "pending",
  },
  {
    id: 5,
    entity: "CS",
    companyName: "A",
    industry: "Cosmetics",
    producttype: "IGTe",
    status: "pending",
  },
];

export default function Page() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "approve" | "decline" | null
  >(null);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setCurrentRequestId(id);
    setCurrentAction("approve");
    setIsModalOpen(true);
  };

  const handleDecline = (id: number) => {
    setCurrentRequestId(id);
    setCurrentAction("decline");
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (currentAction === "approve" && currentRequestId) {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequestId ? { ...req, status: "approved" } : req
        )
      );
    } else if (currentAction === "decline" && currentRequestId) {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequestId ? { ...req, status: "declined" } : req
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
      req.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.producttype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Prospect Request</h1>

      {/* Add buttons here */}
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => console.log("Create new prospect clicked")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Create New Prospect
        </Button>
        <Button
          onClick={() => console.log("Test button clicked")}
          className="bg-gray-500 hover:bg-gray-600"
        >
          Test Button
        </Button>
      </div>

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
            <TableRow key={req.id}>
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
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(req.id)}
                    disabled={req.status !== "pending"}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Track State
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecline(req.id)}
                    disabled={req.status !== "pending"}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Withdraw
                  </Button>
                  {req.status !== "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleReset(req.id)}
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        action={currentAction!}
      />
    </div>
  );
}
