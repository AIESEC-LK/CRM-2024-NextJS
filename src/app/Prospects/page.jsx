"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Search } from "lucide-react";

const ProspectsPage = () => {
  const [prospects, setProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Define filters
  const [industry, setIndustry] = useState("");
  const [product, setProduct] = useState("");
  const [stage, setStage] = useState("");
  const [entity, setEntity] = useState("");

  const entityColors = {
    "Colombo South": "bg-blue-500",
    "Colombo North": "bg-maroon-500",
    "Rajarata": "bg-green-500",
  };

  useEffect(() => {
    // Fetch prospects data from the API
    const fetchProspects = async () => {
      try {
        const res = await fetch("/api/prospects");
        const data = await res.json();
        console.log(data);
        setProspects(data.Prospects);
      } catch (error) {
        console.error("Error fetching prospects:", error);
      }
    };

    fetchProspects();
  }, []);

  // Filter prospects based on search term
  const filteredProspects = prospects?.filter((prospect) => {
    const companyName = prospect.companyName ? prospect.companyName.toLowerCase() : "";
    const entityName = prospect.entity ? prospect.entity.toLowerCase() : "";
    return (
      companyName.includes(searchTerm.toLowerCase()) || entityName.includes(searchTerm.toLowerCase())
    );
  }) || [];

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Partnerships</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <div className="relative mb-4 md:w-1/3">
          <Input
            type="text"
            placeholder="Filter by company name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Industry Filter */}
        <select 
          value={industry} 
          onChange={(e) => setIndustry(e.target.value)} 
          className="border rounded p-2 md:w-1/4 mb-4"
        >
          <option value="">Select Industry</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="food_and_beverages">Food & Beverages</option>
          <option value="startup">Startup</option>
          <option value="apparel">Apparel</option>
          <option value="apparel">Multi National</option>
          <option value="apparel">NGO</option>
          <option value="apparel">Tourism</option>
          <option value="apparel">Construction</option>
          <option value="apparel">FMCG</option>
          <option value="apparel">Health Services</option>
          <option value="apparel">Beauty and cosmetics</option>
          <option value="apparel">Advertising and marketing</option>
          <option value="apparel">Automobile</option>
          <option value="apparel">Manufacturing</option>
          <option value="apparel">Telecommunication</option>
          <option value="apparel">Banking and financial institutions</option>
          <option value="apparel">Transportation</option>
          <option value="apparel">Insurance</option>
          <option value="apparel">Congomerate</option>
          <option value="apparel">Shipping and Logistics</option>
          <option value="apparel">Design and Architecture</option>
          <option value="apparel">Goverment institutes</option>
        </select>

        {/* Product Filter */}
        <select 
          value={product} 
          onChange={(e) => setProduct(e.target.value)} 
          className="border rounded p-2 md:w-1/4 mb-4"
        >
          <option value="">Select Product</option>
          <option value="OGV">OGV</option>
          <option value="IGV">IGV</option>
          <option value="IGTa">IGTa</option>
          <option value="IGTe">IGTe</option>
          <option value="H4TF">H4TF</option>
        </select>

        {/* Stage Filter */}
        <select 
          value={stage} 
          onChange={(e) => setStage(e.target.value)} 
          className="border rounded p-2 md:w-1/4 mb-4"
        >
          <option value="">Select Stage</option>
          <option value="unoccupied">Unoccupied</option>
          <option value="prospect">Prospect</option>
          <option value="lead">Lead</option>
          <option value="customer">Customer</option>
          <option value="promoter">Promoter</option>
        </select>

        {/* Entity Filter */}
        <select 
          value={entity} 
          onChange={(e) => setEntity(e.target.value)} 
          className="border rounded p-2 md:w-1/4 mb-4"
        >
          <option value="">Select Entity</option>
          <option value="Colombo South">Colombo South</option>
          <option value="Colombo North">Colombo North</option>
          <option value="Colombo Central">Colombo Central</option>
          <option value="Jayawardhanapura">Jayawardenapura</option>
          <option value="Rajarata">Rajarata</option>
          <option value="Rajarata">Rruhuna</option>
          <option value="NIBM">NIBM</option>
          <option value="NSBM">NSBM</option>
          <option value="SLIIT">SLIIT</option>
          <option value="SLIIT">Kandy</option>
          <option value="SLIIT">MC</option>
          <option value="SLIIT">MC 01</option>
          <option value="SLIIT">MC 02</option>
          <option value="SLIIT">MC 03</option>
        </select>
      </div>

      {/* Table of Prospects */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Events</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProspects.map((prospect) => (
            <TableRow key={prospect._id}>
              <TableCell>{prospect.companyName}</TableCell>
              <TableCell>
                <span className={`badge ${entityColors[prospect.entity]} text-white`}>
                  {prospect.entity} {prospect.approvalStatus === "Promoter" ? "Promoter" : "Prospect"}
                </span>
              </TableCell>
              <TableCell>{prospect.productPartner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProspectsPage;
