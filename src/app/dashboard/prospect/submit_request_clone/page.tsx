'use client';

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select } from "@/app/components/ui/select"; 
import { useState, useEffect } from "react";
import {
  fetchIndustry,
  fetchProducts,
  Industry,
  Product,
  fetchCompanyQuery,
  fetchCompany,
} from "./functions"; 
import { Button } from "@/app/components/ui/button";

export default function SubmitRequestPage() {
  const [companyName, setCompanyName] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]); 
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [comment, setComment] = useState("");

  // Reset form to initial state
  const resetForm = () => {
    setCompanyName("");
    setCompanySuggestions([]);
    setCompanyAddress("");
    setContactPersonName("");
    setCompanyPhone("");
    setCompanyEmail("");
    setSelectedIndustry("");
    setSelectedProduct("");
    setComment("");
  };

  // Load industries when the component mounts
  useEffect(() => {
    const loadIndustries = async () => {
      const fetchedIndustries = await fetchIndustry();
      setIndustries(fetchedIndustries);
    };
    loadIndustries();
  }, []);

  // Load products when the component mounts
  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  // Fetch suggestions when the company name changes
  const handleCompanySearch = async (query: string) => {
    setCompanyName(query);
    if (query.length > 2) {
      const suggestions = await fetchCompanyQuery(query);
      setCompanySuggestions(suggestions || []);
    } else {
      setCompanySuggestions([]);
    }
  };

  // Handle selection from dropdown
  const handleCompanySelection = async (company: any) => {
    setCompanyName(company.companyName);
    setCompanySuggestions([]); // Clear suggestions dropdown

    // Fetch company details and auto-fill fields
    const companyDetails = await fetchCompany(company._id);
    if (companyDetails) {
      setCompanyAddress(companyDetails.companyAddress || "");
      setContactPersonName(companyDetails.contactPersonName || "");
      setCompanyPhone(companyDetails.contactPersonNumber || "");
      setCompanyEmail(companyDetails.contactPersonEmail || "");
      setSelectedIndustry(companyDetails.industry_id || "");
    }
  };

  return (
    <>
      <div className="container mx-auto pt-0">
        <h1 className="text-2xl font-bold mb-6 ml-4">Submit Request</h1>
        <div className="grid grid-cols-2 gap-16 pr-6">
          <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <Label htmlFor="name" className="block mb-2">
                Company Name:
              </Label>
              <div className="relative">
                <Input
                  placeholder="Type your company name"
                  value={companyName}
                  onChange={(e) => handleCompanySearch(e.target.value)}
                  className="w-full mb-4"
                  type="text"
                />
                {companySuggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 w-full z-10 max-h-40 overflow-y-auto">
                    {companySuggestions.map((company) => (
                      <li
                        key={company._id}
                        onClick={() => handleCompanySelection(company)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {company.companyName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Label htmlFor="address" className="block mb-2">
                Company Address:
              </Label>
              <Textarea
                placeholder="Type your company address"
                value={companyAddress}
                className="w-full mb-4"
                onChange={(e) => setCompanyAddress(e.target.value)}
              />

              <Label htmlFor="contactPersonName" className="block mb-2">
                Contact Person Name:
              </Label>
              <Input
                placeholder="Type your contact person name"
                value={contactPersonName}
                onChange={(e) => setContactPersonName(e.target.value)}
                className="w-full mb-4"
                type="text"
              />

              <Label htmlFor="phone" className="block mb-2">
                Contact Person Contact Number:
              </Label>
              <Input
                placeholder="Type your contact person's phone number"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full mb-4"
                type="number"
              />

              <Label htmlFor="email" className="block mb-2">
                Contact Person Email:
              </Label>
              <Input
                placeholder="Type your contact person's email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full mb-4"
                type="email"
              />

              <Label htmlFor="industry" className="block mb-2">
                Industry:
              </Label>
              <Select
                options={industries.map((industry) => ({
                  value: industry._id,
                  label: industry.industryName,
                }))}
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full mb-4"
              />

              <Label htmlFor="product" className="block mb-2">
                Product Type:
              </Label>
              <Select
                options={products.map((product) => ({
                  value: product._id,
                  label: `${product.productName} (${product.abbravation})`,
                }))}
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full mb-4"
              />

              <Label htmlFor="Comments" className="block mb-2">
                Comments:
              </Label>
              <Textarea
                placeholder="Type a comment"
                value={comment}
                className="w-full mb-4"
                onChange={(e) => setComment(e.target.value)}
              />

              <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Add Prospect Request</Button>
              <Button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded ml-4"
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
