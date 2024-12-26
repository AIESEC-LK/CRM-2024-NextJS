'use client';

import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select } from "@/app/components/ui/select";
import ListGroup from "@/app/components/ui/list_groups";
import { formatDate, Product } from "./functions";

export default function MakeALeadPage() {
  const [companyName, setCompanyName] = useState(String);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [partnershipCategoryName, setpartnershipCategoryName] = useState(String);
  const [activeMouStartDate, setActiveMouStartDate] = useState("");
  const [activeMouEndDate, setActiveMouEndDate] = useState("");
  const [leadMouStartDate, setLeadMouStartDate] = useState("");
  const [leadMouEndDate, setLeadMouEndDate] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
   const [activities, setActivities] = useState<string[]>([]);

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
        setActiveMouStartDate(formatDate(prospect.date_added) || "");
        setActiveMouEndDate(formatDate(prospect.date_expires) || "");
        setLeadMouStartDate(formatDate(prospect.date_added) || "");
        setLeadMouEndDate(formatDate(prospect.date_expires) || "");
        setpartnershipCategoryName(prospect.partnership_type || "");
        setActivities(prospect.activities || []);
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
        <h1 className="text-2xl font-bold mb-6 ml-4">Promoter</h1>

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
                value={partnershipCategoryName}
                onChange={(e) => setpartnershipCategoryName(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouStart" className="block mb-2">MOU Start Date:</Label>
              <Input
                placeholder="YYYY/MM/DD"
                value={activeMouStartDate}
                onChange={(e) => setActiveMouStartDate(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouEnd" className="block mb-2">MOU End Date:</Label>
              <Input
                placeholder="YYYY/MM/DD"
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
              <Label htmlFor="companyName" className="block mb-2">Activities:</Label>
              <ListGroup
                values={activities.length > 0 ? activities : ['No activities recorded']}
                className="mt-4 mb-4"
              />
            </div>
          </div>

          {/* Lead Stage */}
          <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <h1 className="text-2xl font-bold mb-6">Lead Stage</h1>
              <Label htmlFor="category" className="block mb-2">Category:</Label>
              <Input
                value={partnershipCategoryName}
                onChange={(e) => setpartnershipCategoryName(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouStart" className="block mb-2">MOU Start Date:</Label>
              <Input
                placeholder="YYYY/MM/DD"
                value={leadMouStartDate}
                onChange={(e) => setLeadMouStartDate(e.target.value)}
                className="w-full mb-4"
                type="text"
                disabled
              />
              <Label htmlFor="mouEnd" className="block mb-2">MOU End Date:</Label>
              <Input
                placeholder="YYYY/MM/DD"
                value={leadMouEndDate}
                onChange={(e) => setLeadMouEndDate(e.target.value)}
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
