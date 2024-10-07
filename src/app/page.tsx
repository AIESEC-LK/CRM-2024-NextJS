'use client'

import React, { useEffect, useState } from "react";

// Define the shape of the data you expect to receive
interface Lead {
  id: number;
  name: string;
  email_from: string;
  contact_name: string | boolean;
  phone: string;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]); // State to store leads data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status

  // Fetch the leads data from the API on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Fetch data from the Next.js API route
        const response = await fetch("/api/load_leads_odoo");
        const data = await response.json();
        setLeads(data.result); // Set the leads data from the API response
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLoading(false);
      }
    };

    fetchLeads(); // Call the function to fetch data when the component mounts
  }, []);

  if (loading) {
    return <p>Loading leads...</p>; // Show loading state
  }

  return (
    <div>
      <h1 className="text-4xl font-bold underline">Leads List</h1>
      <ul>
        {/* Iterate over leads and render them */}
        {leads.map((lead) => (
          <li key={lead.id} className="mt-4">
            <p><strong>ID:</strong> {lead.id}</p>
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email_from}</p>
            <p><strong>Phone:</strong> {lead.phone}</p>
            <p><strong>Contact Name:</strong> {lead.contact_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
