"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface ProspectRequest {
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
  createdAt: string;
}

export default function ViewProspectRequest() {
  const [prospectRequest, setProspectRequest] =
    useState<ProspectRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProspectRequest = async () => {
      try {
        const response = await fetch(
          `/api/admin/prospect_request/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch prospect request details");
        }
        const data = await response.json();
        setProspectRequest(data);
      } catch (error) {
        setError("Error fetching prospect request details. Please try again.");
        console.error("Error fetching prospect request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProspectRequest();
  }, [params.id]);

  const handleStatusChange = async (newStatus: "approved" | "declined") => {
    try {
      const response = await fetch(`/api/admin/prospect_request/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update prospect request status");
      }

      setProspectRequest((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    } catch (error) {
      console.error("Error updating prospect request status:", error);
      setError("Failed to update prospect request status. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!prospectRequest)
    return <div className="text-center mt-8">Prospect request not found</div>;

  return (
    <div className="container mx-auto pt-8 px-4 sm:px-6 lg:px-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prospects
      </Button>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Prospect Request Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Company Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Entity:</span>{" "}
                {prospectRequest.entity}
              </p>
              <p>
                <span className="font-medium">Company Name:</span>{" "}
                {prospectRequest.companyName}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {prospectRequest.companyAddress}
              </p>
              <p>
                <span className="font-medium">Industry:</span>{" "}
                {prospectRequest.industry}
              </p>
              <p>
                <span className="font-medium">Product Type:</span>{" "}
                {prospectRequest.producttype}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {prospectRequest.contactPersonName}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {prospectRequest.contactPersonNumber}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {prospectRequest.contactPersonEmail}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Request Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Status:</span>
            </p>
            <p>
              <span className="font-medium">Request Date:</span>{" "}
              {formatDate(prospectRequest.createdAt)}
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <Button
            onClick={() => handleStatusChange("approved")}
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={prospectRequest.status === "approved"}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Approve
          </Button>
          <Button
            onClick={() => handleStatusChange("declined")}
            variant="destructive"
            disabled={prospectRequest.status === "declined"}
          >
            <XCircle className="mr-2 h-4 w-4" /> Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
