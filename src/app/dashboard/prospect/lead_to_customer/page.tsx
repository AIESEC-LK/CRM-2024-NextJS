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
import { formatDate, Product } from "./functions";
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';


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
  const [partnershipType, setPartnershipType] = useState('');
  const [amount, setAmount] = useState('');
    const [id, setId] = useState('');

  const searchParams = useSearchParams();


  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setId(id);
    }
  }, [searchParams])


   

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

  const resetForm = () => {
  setpartnershipCategoryName('');
  setLeadMouStartDate('');
  setLeadMouEndDate('');
  setPartnershipType('');
  setAmount('');
};


const handleSubmit = async () => {
    const data = {
      id,
      partnershipCategoryName,
      leadMouStartDate,
      leadMouEndDate,
      partnershipType,
      status: 'customerPending',
      ...(partnershipType === 'monetary' && { amount }),
    };

    try {
      const response = await fetch('/api_new/prospects/update_a_prospect', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Form submitted successfully');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
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
              <h1 className="text-2xl font-bold mb-6">Active Stage</h1>
              <Label htmlFor="category" className="block mb-2">Category:</Label>
              <Input
                value={partnershipCategoryName}
                onChange={(e) => setpartnershipCategoryName(e.target.value)}
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
    <Label htmlFor="partnershipType" className="block mb-2">Partnership Type:</Label>
    <Select
      value={partnershipType}
      onChange={(e) => setPartnershipType(e.target.value)}
      className="w-full mb-4"
      options={[
        { value: 'monetary', label: 'Monetary' },
        { value: 'inkind', label: 'In-Kind' }
      ]}
    />
    {partnershipType === 'monetary' && (
      <>
        <Label htmlFor="amount" className="block mb-2">Amount:</Label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4"
          type="text"
        />
      </>
    )}
    <Label htmlFor="mouStart" className="block mb-2">MOU Start Date:</Label>
    <Input
      placeholder="YYYY/MM/DD"
      value={leadMouStartDate}
      onChange={(e) => setLeadMouStartDate(e.target.value)}
      className="w-full mb-4"
      type="date"
    />
    <Label htmlFor="mouEnd" className="block mb-2">MOU End Date:</Label>
    <Input
      placeholder="YYYY/MM/DD"
      value={leadMouEndDate}
      onChange={(e) => setLeadMouEndDate(e.target.value)}
      className="w-full mb-4"
      type="date"
    />

    <Button 
      className="bg-gray-900 text-white px-4 py-2 rounded-md mb-4"
      onClick={handleSubmit}
    >
      Proceed
    </Button>
    <Button 
      className="bg-gray-400 text-gray-900 px-4 py-2 rounded-md ml-4"
      onClick={resetForm}
    >
      Reset
    </Button>
  </div>
</div>
        </div>
      </div>
    </>
  );
}
