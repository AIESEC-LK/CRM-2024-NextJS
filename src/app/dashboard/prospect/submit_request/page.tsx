"use client";

import React, { useState } from 'react';
import { IRequest } from '@/app/models/RequestTypes';

const Page: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyAddress: '',
    contactPersonName: '',
    contactPersonNumber: '',
    contactPersonEmail: '',
    industry: '',
    producttype: '',
    comment: '',
    partnership:'',
  });
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
    if (name === "name" && value) {
      fetchCompanies(value);
    } else {
      setShowDropdown(false);
    }
  };

  const fetchCompanies = async (query: string) => {
    try {
      const res = await fetch(`/api/prospects/search?companyName=${query}`);
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
      name: company.companyName,
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

    try {
      const res = await fetch("/api/prospect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Handle success (e.g., display success message, reset form)
        // console.log("Form submitted successfully!");
      } else {
        // Handle error response
        console.error("Form submission failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };


  const industries = [
    { label: 'Technology', value: 'tech' },
    { label: 'Finance', value: 'finance' },
    { label: 'Healthcare', value: 'healthcare' },
  ];

  const productTypes = [
    { label: 'Software', value: 'software' },
    { label: 'Hardware', value: 'hardware' },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Add New Prospect Request</h2>

        <div className="mb-4 relative">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Company Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            value={formData.companyAddress}
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
            value={formData.contactPersonName}
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
            value={formData.contactPersonNumber}
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
            value={formData.contactPersonEmail}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="industry" className="block text-sm font-medium mb-1">
            Select an Industry
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select an Industry</option>
            {industries.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            value={formData.producttype}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a Product Type</option>
            {productTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            value={formData.comment}
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
