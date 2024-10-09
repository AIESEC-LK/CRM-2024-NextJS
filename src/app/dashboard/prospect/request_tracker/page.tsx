"use client"; // Enable client-side rendering in Next.js

import React from "react";

const page: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Delivery Status Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-600">Approved</h1>
        <div className="mt-2 text-gray-600">
          <p>
            Prospect Request ID: <span className="font-semibold">1234567890</span>
          </p>
          <p>
          Prospect Request Date: <span className="font-semibold">01 July, 2024</span>
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-gray-600">
            <p>
              Entity: <span className="font-semibold">Colombo South</span>
            </p>
            <p>
            Product Type: <span className="font-semibold">Colombo South</span>
            </p>
            <p>
              Company Name: <span className="font-semibold">Colombo South</span>
            </p>

          </div>
        </div>
      </div>

      {/* Shipment Tracking */}
      <div className="bg-gray-50 p-6 rounded-lg relative">
        <h2 className="text-xl font-semibold mb-6">Prospect Request Tracking</h2>

        {/* Connecting Line */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-16 right-16 h-1 bg-green-500"></div>

        <div className="flex justify-between items-center relative z-10 space-x-6">
          {/* Tracking Step: Received */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold">Received</p>
            <p className="text-sm text-gray-600">Test, MCVP</p>
            <p className="text-sm text-gray-600">02 Jul, 2024, 10:25 AM</p>
          </div>

          {/* Tracking Step: Picked */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3v4a1 1 0 001 1h3l4 9v5a1 1 0 001 1h2a1 1 0 001-1v-5l4-9h3a1 1 0 001-1V3"
                />
              </svg>
            </div>
            <p className="font-semibold">Approved</p>
            <p className="text-sm text-gray-600">Test, MCVP</p>
            <p className="text-sm text-gray-600">02 Jul, 2024, 10:25 AM</p>
          </div>

          {/* Tracking Step: In-transit */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v5a1 1 0 001 1h4a1 1 0 001-1v-5M7 7h10l1.34 2H5.66L7 7z"
                />
              </svg>
            </div>
            <p className="font-semibold">Approved</p>
            <p className="text-sm text-gray-600">Test, MCVP</p>
            <p className="text-sm text-gray-600">02 Jul, 2024, 10:25 AM</p>
          </div>


          {/* Tracking Step: Delivered */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold">Approved</p>
            <p className="text-sm text-gray-600">Test, MCVP</p>
            <p className="text-sm text-gray-600">02 Jul, 2024, 10:25 AM</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default page;
