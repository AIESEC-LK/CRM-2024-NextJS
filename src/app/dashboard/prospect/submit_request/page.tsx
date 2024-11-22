"use client";

import React, { useEffect, useState } from 'react';
import { IRequest } from '@/app/models/RequestTypes';
import { fetchProducts, fetchIndustry, submitProspect, FormData, Industry, Product } from './functions';

const Page: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industriesLoading, setIndustriesLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setProductsLoading(false);
    };

    const loadIndustries = async () => {
      setIndustriesLoading(true);
      const data2 = await fetchIndustry();
      setIndustries(data2);
      setIndustriesLoading(false);
    };

    loadProducts();
    loadIndustries();
  }, []);


  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyAddress: '',
    contactPersonName: '',
    contactPersonNumber: '',
    contactPersonEmail: '',
    industry: '',
    producttype: '',
    comment: '',
    partnership: ''
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<IRequest[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  console.log("Dropdown visibility:", showDropdown, "Search results:", searchResults);
  // const [suggestedPartnership, setSuggestedPartnership] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "companyName" && value) {
      fetchCompanies(value);
    } else {
      setShowDropdown(false);
    }
  };

  const fetchCompanies = async (query: string) => {
    try {
      const res = await fetch(`/api_new/companies/get_by_query?companyName=${query}`);
      if (res.ok) {
        const data = await res.json();
        // console.log("Fetched data:", data); 
        setSearchResults(data);
        setShowDropdown(data.length > 0);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // const handleSelectCompany = (name: string) => {
  //   setFormData((prev) => ({ ...prev, name: name }));
  //   setShowDropdown(false);
  // };

  const handleSelectCompany = (company: IRequest) => {
    console.log("Selected Company:", company);
    setFormData({
      ...formData,
      companyName: company.companyName,
      companyAddress: company.companyAddress || "",
      contactPersonName: company.contactPersonName,
      contactPersonNumber: company.contactPersonNumber || "",
      contactPersonEmail: company.contactPersonEmail || "",
      industry: company.industry,
      producttype: company.producttype,
      comment: company.comment || "",
      partnership: company.partnership || "",
    });
    setShowDropdown(false);
    console.log("Updated Form Data:", formData);
    // const suggestedPartnership =
    // company.partnership === "event" ? "product" : "event";

    // setSuggestedPartnership(suggestedPartnership);
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    /*const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage(null);
      return;
    }*/

    // Submit form data
    const success = await submitProspect(formData);
    if (success) {
      setSuccessMessage('Form submitted successfully!');
      setErrorMessage(null);
      //setFormData({ productName: '', abbravation: '' }); // Reset form
    } else {
      setErrorMessage('Failed to submit the form. Please try again.');
      setSuccessMessage(null);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Add New Prospect Request</h2>

        <div className="mb-4 relative">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            onChange={handleChange}
            value={formData.companyName as string}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {showDropdown && (
            <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <li
                  key={result._id}
                  onClick={() => handleSelectCompany(result)}
                  className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                >
                  {result.companyName} - Current Partnership: {result.partnership || "None"}
                </li>
              ))}
            </ul>
          )}
          
          {/* {suggestedPartnership && (
          <p className="text-sm text-gray-600 mt-1">
            Suggested Partnership: Try a <strong>{suggestedPartnership}</strong> partnership.
          </p>
        )} */}
        
        </div>
        <div className="mb-4">
          <label htmlFor="companyAddress" className="block text-sm font-medium mb-1">
            Company Address
          </label>
          <textarea
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress as string}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contactPersonName" className="block text-sm font-medium mb-1">
            Contact Person Name
          </label>
          <input
            id="contactPersonName"
            type="text"
            name="contactPersonName"
            value={formData.contactPersonName as string}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contactPersonNumber" className="block text-sm font-medium mb-1">
            Contact Person Contact Number
          </label>
          <input
            id="contactPersonNumber"
            type="text"
            name="contactPersonNumber"
            value={formData.contactPersonNumber as string}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contactPersonEmail" className="block text-sm font-medium mb-1">
            Contact Person Email Address
          </label>
          <input
            id="contactPersonEmail"
            type="email"
            name="contactPersonEmail"
            value={formData.contactPersonEmail as string}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="producttype" className="block text-sm font-medium mb-1">
            Select a Industry
          </label>

          <select
            id="industry"
            name="industry"
            value={formData.industry as string} // Bind the dropdown to formData.industry
            onChange={handleChange}   // Update formData when a new industry is selected
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              -- Select an Industry --
            </option>
            {industries.map((industry) => (
              <option key={industry._id} value={industry._id}>
                {industry.industryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="producttype" className="block text-sm font-medium mb-1">
            Select a Product Type
          </label>

          <select
            id="producttype"
            name="producttype"
            value={formData.producttype as string} // Bind the dropdown to formData.industry
            onChange={handleChange}   // Update formData when a new industry is selected
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              -- Select an Industry --
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.productName}
              </option>
            ))}
          </select>

          
          
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Comments
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment as string}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Request
        </button>
      </form>

    </div>
  );
};

export default Page;
