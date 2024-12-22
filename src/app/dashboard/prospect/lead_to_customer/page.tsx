'use client';

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select } from "@/app/components/ui/select";
import ProgressBar from "@/app/components/ui/progress";
import ListGroup from "@/app/components/ui/list_groups";
import Image from "next/image";
import ToastNotification from "@/app/components/ui/toast"; // Assume you have this component
import { Product } from "./functions";

export default function MakeALeadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState(String);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [partnershipCategoryName, setpartnershipCategoryName] = useState("Inkind Partnership");
  const [activeStateApproval, setActiveStateApproval] = useState("approved");
  const [prospectStateApproval, setProspecttateApproval] = useState("approved");
  const [leadStateApproval, setLeadStateApproval] = useState("approved");
  const [activeMouStartDate, setActiveMouStartDate] = useState("2024-01-01");
  const [activeMouEndDate, setActiveMouEndDate] = useState("2024-01-01");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api_new/products/get_all_products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    async function fetchProspect() {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (!id) {
        console.error("No ID provided in the URL");
        return;
      }

      try {
        const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch prospect");
        }
        const prospect = await response.json();
        setCompanyName(prospect.company_name || "");
        setSelectedProduct(prospect.product_type_id || "");
      } catch (error) {
        console.error("Error fetching prospect:", error);
      }
    }

    fetchProducts();
    fetchProspect();
  }, []);

  return (
    <>
      <div className="container mx-auto pt-0 pr-4">
        <h1 className="text-2xl font-bold mb-6 ml-4">Lead to Customer Pending</h1>

        {/* Lead Details Row */}
        <div className="w-full ml-4 mb-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6">Lead Details</h1>
            <Label htmlFor="name" className="block mb-2">Company Name:</Label>
            <Input
              placeholder="Company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full mb-4"
              type="text"
              disabled
            />
            <Label htmlFor="product" className="block mb-2">Product:</Label>
            <Select
              options={products.map(product => ({
                value: product._id,
                label: `${product.productName} (${product.abbravation})`
              }))}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Single Row for Stages */}
        <div className="grid grid-cols-3 gap-6 pl-4">
          {/* Active Stage - Customer */}
          <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <h1 className="text-2xl font-bold mb-6">Active Stage - Customer</h1>
              <Label htmlFor="category" className="block mb-2">Category:</Label>
              <Input
                placeholder="Partnership Category"
                value={partnershipCategoryName}
                onChange={(e) => setpartnershipCategoryName(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouStart" className="block mb-2">MOU Start Date:</Label>
              <Input
                placeholder="2024/12/31"
                value={activeMouStartDate}
                onChange={(e) => setActiveMouStartDate(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouEnd" className="block mb-2">MOU End Date:</Label>
              <Input
                placeholder="2024/12/31"
                value={activeMouEndDate}
                onChange={(e) => setActiveMouEndDate(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
            </div>
          </div>

          {/* Prospect Stage */}
          <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <h1 className="text-2xl font-bold mb-6">Prospect Stage</h1>
              <Label htmlFor="companyName" className="block mb-2">Company Name:</Label>
              <Input
                placeholder="Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
            </div>
          </div>

          {/* Lead Stage */}
          <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <h1 className="text-2xl font-bold mb-6">Lead Stage</h1>
              <Label htmlFor="category" className="block mb-2">Category:</Label>
              <Input
                placeholder="Partnership Category"
                value={partnershipCategoryName}
                onChange={(e) => setpartnershipCategoryName(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouStart" className="block mb-2">MOU Start Date:</Label>
              <Input
                placeholder="2024/12/31"
                value={activeMouStartDate}
                onChange={(e) => setActiveMouStartDate(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouEnd" className="block mb-2">MOU End Date:</Label>
              <Input
                placeholder="2024/12/31"
                value={activeMouEndDate}
                onChange={(e) => setActiveMouEndDate(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
