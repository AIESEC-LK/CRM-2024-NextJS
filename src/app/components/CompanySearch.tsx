'use client';
import { format } from 'date-fns';
import React, { useState } from 'react';

interface ICompanyQuery {
    _id: string;
    companyName: string;
    dateexpiresEvent:Date;
    dateexpiresProduct:Date;
    approved: boolean;
  }

export default function CompanySearch() {

     const [showDropdown, setShowDropdown] = useState(false);
      const [searchResults, setSearchResults] = useState<ICompanyQuery[]>([]);

    const fetchCompanyQuery = async (query: string) => {
        try {
          const response = await fetch(`/api_new/companies/get_by_query?companyName=${query}`);
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

    return(
    <>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
            Company Name
        </label>
        <input
            autoComplete="off"
            id="companyName"
            type="text"
            name="companyName"
            onChange={(e) => { loadsearchResults(e.target.value); }}            
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        {showDropdown && (
            <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
            {searchResults.map((result) => (
                <li
                    key={result._id}
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
    
    </>
    )
}