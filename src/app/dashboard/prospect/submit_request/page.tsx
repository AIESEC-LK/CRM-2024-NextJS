"use client"; // Enable client-side rendering

import React, { useState } from 'react';

const page: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    contactPersonName: '',
    contactPersonNumber: '',
    contactPersonEmail: '',
    industry: '',
    productType: '',
    comments: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Add New Prospect Request</h2>

      <div className="mb-4">
        <label htmlFor="companyName" className="block text-sm font-medium mb-1">
          Company Name
        </label>
        <input
          id="companyName"
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
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
        <label htmlFor="productType" className="block text-sm font-medium mb-1">
          Select a Product Type
        </label>
        <select
          id="productType"
          name="productType"
          value={formData.productType}
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
        <label htmlFor="comments" className="block text-sm font-medium mb-1">
          Comments
        </label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
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
  );
};

export default page;
