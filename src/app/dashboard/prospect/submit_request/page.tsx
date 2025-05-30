"use client";

import React, { useEffect, useState } from 'react';
import {
  IMyProspectList,
  fetchProducts,
  fetchIndustry,
  submitProspect,
  FormData,
  Industry,
  Product,
  ICompanyQuery
} from './functions';
import { format } from 'date-fns';
import Popup from "@/app/components/popup/Popup";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { IUserDetails, AuthService } from '@/app/services/authService';
import { useConfirmation } from "@/app/context/ConfirmationContext";
import { useAuth } from "@/app/context/AuthContext";

function getLabelByValue(value: string) {
  const result = PROSPECT_VALUES.find(item => item.value === value);
  return result?.label;  // Return label if found, otherwise undefined
}

const Page: React.FC = () => {

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [titlePopup, setPopupTitle] = useState('This is the default message.');
  const [messagePopup, setPopupMessage] = useState('This is the default message.');
  const [isPopupError, setIsPopupError] = useState<boolean>(false);

  const openPopup = (newMessage: string, newTitle: string, isError: boolean ): void => {
    setPopupTitle(newTitle);  // Update the title state dynamically
    setPopupMessage(newMessage);  // Update the message state dynamically
    setIsPopupOpen(true);    // Open the popup
    setIsPopupError(isError);  // Set error state
  };
  const { triggerConfirmation } = useConfirmation();
  const closePopup = (): void => setIsPopupOpen(false);
  const { user } = useAuth();

  const [myProspectList, setmyProspectList] = useState<IMyProspectList[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [industries, setIndustries] = useState<Industry[]>([]);

  const [searchResults, setSearchResults] = useState<ICompanyQuery[]>([]);
  useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    company_id: "",
    companyId: "",
    companyName: "",
    companyAddress: "",
    contactPersonName: "",
    contactPersonNumber: "",
    contactPersonEmail: "",
    producttype: "",
    productId: "",
    comment: "",
    partnership: "",
    industry_id: "",
    industryId: "",
    userLcId: ""
  });


  const fetctMyProspectList = async (entity_id: string) => {
    try {
        const response = await fetch(`/api_new/prospects/get_all_my_prospects?entity_id=${entity_id}`, 
            {
              headers: {
                "x-internal-auth": process.env.INTERNAL_AUTH_SECRET!, // internal secret
              }
            });
        if (!response.ok) {
            throw new Error('Failed to fetch prospect list');
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching prospect list:", error);
    }
};

  const fetchCompanyQuery = async (query: string) => {
    try {
      const response = await fetch(`/api_new/companies/get_by_query?companyName=${query}`, 
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  const loadsearchResults = async (query: string | null) => {
    if (query) {
      const data2 = await fetchCompanyQuery(query);
      if (data2 && data2.length > 0) {
        setSearchResults(data2);
        setShowDropdown(true);
      } else {
        console.log("No suggestions found");
        setShowDropdown(false);
      }
    } else {
      console.log("No suggestions found");
      setShowDropdown(false);
    }
  };

  const fetchCompany = async (company_id: string) => {
    try {
      const response = await fetch(`/api_new/companies/get_by_id?company_id=${company_id}`, 
        {
          headers: {
            "x-internal-auth": process.env.INTERNAL_AUTH_SECRET!, // internal secret
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const loadCompanyData = async (companyid: string) => {
    const data2 = await fetchCompany(companyid);
    data2.productId = industries.find((industry) => industry._id === data2.industry)?._id;
    console.log("Company data 2 : ", data2);
    setFormData(data2);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement & { name: keyof FormData };
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSelectCompany = (companyid: string) => {
    loadCompanyData(companyid);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerConfirmation(
      "Are you sure you want to add prospect request?",
      async () => {
        if (user) {
          formData.userLcId = user.lcId;
        } else {
          console.error("User is null");
          return;
        }
        const submitResponse = await submitProspect(formData);

        if (submitResponse instanceof Response) {
          // If the response is successful, you can check for a status or extract a message from the response
          if (submitResponse.ok) {
            const errorData = await submitResponse.json();
            const response = await fetctMyProspectList(user.lcId);
            setmyProspectList(response);
            setFormData({
              company_id: "",
              companyId: "",
              companyName: "",
              companyAddress: "",
              contactPersonName: "",
              contactPersonNumber: "",
              contactPersonEmail: "",
              producttype: "",
              productId: "",
              comment: "",
              partnership: "",
              industry_id: "",
              industryId: "",
              userLcId: ""
            });
            openPopup(errorData.error, "Successful", false); // Assuming the response returns a success message

          } else {
            // Handle response failure if you want to extract error message from the response body
            const errorData = await submitResponse.json(); // Assuming the response returns a JSON error message

            openPopup("Please fill the form correctly.", "Failed", true);

          }
        } else if (submitResponse instanceof Error) {
          // If an error is thrown, display the error message
          openPopup(submitResponse.message || "Something went wrong. Please try again.", "Failed", true);
        }
      }
    );

  };

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    const loadIndustries = async () => {
      const data2 = await fetchIndustry();
      setIndustries(data2);
    };

    fetctMyProspectList(user?.lcId || "")
    loadProducts();
    loadIndustries();
  }, []);

  return (
    <div className="container mx-auto pt-0">
      <div className="w-full ml-4 mb-6 bg-gray-100 rounded overflow-hidden shadow-lg flex items-center pt-3 pb-3">
      <h1 className="text-2xl font-bold ml-4"><i className="fa-regular fa-lightbulb mr-4"></i>Prospect Request</h1>
      </div>
      <Popup isOpen={isPopupOpen} close={closePopup} title={titlePopup} message={messagePopup} isError={isPopupError} />
      <div className="grid grid-cols-2 gap-16 pr-6">
        <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <form onSubmit={handleSubmit} >
              <h2 className="text-xl font-semibold mb-6">
                <i className="fa-solid fa-pencil mr-4"></i>
                Add New Prospect Request</h2>

              <div className="mb-4 relative">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoComplete="off"
                  id="companyName"
                  type="text"
                  name="companyName"
                  onChange={(e) => { handleChange(e); loadsearchResults(e.target.value); }}
                  value={formData.companyName as string}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />


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
                            <div>
                              Event Partnership Expires:{" "}
                              {format(
                                result.dateexpiresEvent,
                                "MMMM dd, yyyy hh:mm a"
                              )}
                            </div>
                          )}

                          {result.dateexpiresProduct && (
                            <div>
                              Product Partnership Expires:{" "}
                              {format(
                                result.dateexpiresProduct,
                                "MMMM dd, yyyy hh:mm a"
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
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
                    ),) || (<>
                      <li>No results found</li>
                    </>
                      )}
                  </ul>
                )}


              </div>
              <div className="mb-4">
                <label
                  htmlFor="companyAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Company Address <span className="text-red-500">*</span>
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
                <label
                  htmlFor="contactPersonName"
                  className="block text-sm font-medium mb-1"
                >
                  Contact Person Name <span className="text-red-500">*</span>
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
                <label
                  htmlFor="contactPersonNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Contact Person Contact Number <span className="text-red-500">*</span>
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
                <label
                  htmlFor="contactPersonEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Contact Person Email Address <span className="text-red-500">*</span>
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
                <label
                  htmlFor="producttype"
                  className="block text-sm font-medium mb-1"
                >
                  Select a Industry <span className="text-red-500">*</span>
                </label>

                <select
                  id="industry"
                  name="industryId"
                  value={formData.industryId} // Bind the dropdown to formData.industryId
                  onChange={handleChange} // Update formData when a new industry is selected
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
                <label
                  htmlFor="producttype"
                  className="block text-sm font-medium mb-1"
                >
                  Select a Product Type <span className="text-red-500">*</span>
                </label>

                <select
                  id="producttype"
                  name="producttype"
                  value={formData.producttype as string} // Bind the dropdown to formData.industry
                  onChange={handleChange} // Update formData when a new industry is selected
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
                className="w-full py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-5 py-14">
            <h2 className="text-xl font-semibold mb-6">
              <i className = "fa-solid fa-note-sticky mr-4"></i>
              Prospect Request History</h2>

            <div className="overflow-x-auto max-h-80" style={{ maxHeight: '800px' }}>  {/* Add max height and horizontal scroll if needed */}
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Company Name</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Submission Date</th>
                    <th className="px-4 py-2 text-left">Submission Expires</th>
                    <th className="px-4 py-2 text-left">Product Type</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {myProspectList && myProspectList.length > 0 ? (
                    myProspectList.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-2">{item.company_name}</td>
                        <td className="px-4 py-2">{getLabelByValue(item.status)}</td>
                        <td className="px-4 py-2">
                          {item.date_added
                            ? new Date(item.date_added).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {item.date_expires
                            ? new Date(item.date_expires).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">{item.product_type_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-2 text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
};

export default Page;
