"use client";

import React, { useEffect, useState } from 'react';
import { IRequest } from '@/app/models/RequestTypes';
import { fetctMyProspectList, IMyProspectList, fetchCompany, fetchProducts, fetchIndustry, submitProspect, FormData, Industry, Product, fetchCompanyQuery, ICompanyQuery } from './functions';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import Popup from "@/app/components/popup/Popup";

const Page: React.FC = () => {

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [titlePopup, setPopupTitle] = useState('This is the default message.');
  const [messagePopup, setPopupMessage] = useState('This is the default message.');

  const openPopup = (newMessage: string, newTitle: string): void => {
    setPopupTitle(newTitle);  // Update the title state dynamically
    setPopupMessage(newMessage);  // Update the message state dynamically
    setIsPopupOpen(true);    // Open the popup
  };

  const closePopup = (): void => setIsPopupOpen(false);

  const [myProspectList, setmyProspectList] = useState<IMyProspectList[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industriesLoading, setIndustriesLoading] = useState<boolean>(true);

  const [searchResults, setSearchResults] = useState<ICompanyQuery[]>([]);
  const [searchResultsLoading, setsearchResultsLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState(false);
  //console.log("Dropdown visibility:", showDropdown, "Search results:", searchResults);

  const [companyData, setcompanyData] = useState<FormData>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    companyId: '',
    companyName: '',
    companyAddress: '',
    contactPersonName: '',
    contactPersonNumber: '',
    contactPersonEmail: '',
    productId: '',
    comment: '',
    partnership: '',
    industry_id: ''
  });

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


    const loadMyProspectList = async () => {
      const myProspectList = await fetctMyProspectList("586");
      //setmyProspectList(myProspectList);
    };

    setmyProspectList([{
      _id: "67694b10855d970eb0dd3712",
      date_added: "2024-12-23T11:35:44.123Z",
      date_expires: "2025-03-23T11:35:44.123Z",
      status: "prospect",
      company_name: "Sri Lanka Insurance Ltd",
      product_type_name: "Event"
    }]);

    //loadMyProspectList();
    loadProducts();
    loadIndustries();
  }, []);

  const loadsearchResults = async (query: string) => {
    setsearchResultsLoading(true);
    const data2 = await fetchCompanyQuery(query);
    setSearchResults(data2);
    setsearchResultsLoading(false);
    setShowDropdown(true);
  };

  const loadCompanyData = async (companyid: string) => {
    const data2 = await fetchCompany(companyid);
    data2.productId = industries.find((industry) => industry._id === data2.industry)?._id;
    //setcompanyData(data2);
    console.log("Company data 2:", data2);
    setFormData(data2);

  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Name:", name, "Value:", value);
    setFormData({
      ...formData,
      [name]: value,
      //company_id: ''
    });

    if (name === "companyName" && value) {
      loadsearchResults(value);
    } else {
      setShowDropdown(false);

    }
  };

  const handleSelectCompany = (companyid: string) => {
    loadCompanyData(companyid);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    // Validate form data
    /*
    const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage(null);
      return;
    }*/

    // Submit form data
    const submitResponse = await submitProspect(formData);

    if (submitResponse instanceof Response) {
      // If the response is successful, you can check for a status or extract a message from the response
      if (submitResponse.ok) {
        const errorData = await submitResponse.json();
        openPopup(errorData.error, "Caution!");
        setErrorMessage(errorData.error);
        setErrorMessage(null);
      } else {
        // Handle response failure if you want to extract error message from the response body
        const errorData = await submitResponse.json(); // Assuming the response returns a JSON error message

        openPopup(errorData.error, "Failed");
        setErrorMessage(errorData.error);

        console.log("Error data:", errorData);
        setSuccessMessage(null);
      }
    } else if (submitResponse instanceof Error) {
      // If an error is thrown, display the error message
      openPopup(submitResponse.message || "Something went wrong. Please try again.", "Failed");
      setErrorMessage(submitResponse.message || 'Something went wrong. Please try again.');
      setSuccessMessage(null);
    }
  };


  return (
    <div className="grid grid-cols-3 h-screen">
      <Popup isOpen={isPopupOpen} close={closePopup} title={titlePopup} message={messagePopup} />
      <div className="col-span-2 p-6">
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
            {/*
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
          )}*/}

            {showDropdown && (
              <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                {searchResults.map((result) => (
                  <li
                    key={result._id}
                    onClick={() => handleSelectCompany(result._id)}
                    className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                  >
                    <div>
                      <span className="font-semibold">{result.companyName}</span>
                    </div>
                    <div className="ml-4 mt-1 text-sm text-gray-500">

                      {result.dateexpiresEvent && (
                        <div>Product Partnership Expires: {format(result.dateexpiresEvent, "MMMM dd, yyyy hh:mm a")}</div>
                      )}

                      {result.dateexpiresProduct && (
                        <div>EventPartnership Expires: {format(result.dateexpiresProduct, "MMMM dd, yyyy hh:mm a")}</div>
                      )}
                    </div>
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
              autoComplete="off"
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
              name="industry_id"
              value={formData.industry_id as string} // Bind the dropdown to formData.industry
              onChange={handleChange}   // Update formData when a new industry is selected
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                -- Select an Industry --
              </option>
              {industries.map((industry) => (
                <option key={industry._id} value={industry._id} >
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
              name="productId"
              value={formData.productId as string} // Bind the dropdown to formData.industry
              onChange={handleChange}   // Update formData when a new industry is selected
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                -- Select an Product Type --
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

      <div className="p-3">
        {/*
        <Table>
          <TableHeader>
            <TableRow>

              <TableHead>Company Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Submission Expires</TableHead>
              <TableHead>Product Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myProspectList.map((item) => (

              <TableRow key={item._id}>
                <TableCell>{item.company_name}</TableCell>
                <TableCell>
                  {item.status}
                </TableCell>
                <TableCell>{item.date_added}</TableCell>
                <TableCell>{item.date_expires}</TableCell>
                <TableCell>{item.product_type_name}</TableCell>
              </TableRow>))};

          </TableBody>
        </Table>*/}
      </div>


    </div>
  );
};

export default Page;
