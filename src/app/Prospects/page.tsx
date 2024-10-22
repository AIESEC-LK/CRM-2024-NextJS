"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Search } from "lucide-react";
import router from "next/router";
import { Button } from "../components/ui/button";

const initialProspects = [
  {
    id: 1,
    entity: "Jayawardenapura",
    companyName: "A",
    industry: "NGO",
    producttype: "IGTa",
    label: "Prospect",

  }, 
  {
    id: 2,
    entity: "Colombo North",
    companyName: "B",
    industry: "Tourism",
    producttype: "IGTe",
    label: "Promoter",

  },
  {
    id: 3,
    entity: "Colombo South",
    companyName: "C",
    industry: "Construction",
    producttype: "OGV",
    label: "Prospect",

  },
  {
    id: 4,
    entity: "SLIIT",
    companyName: "D",
    industry: "Health Services",
    producttype: "OGV",
    label: "Customer",

  },
  {
    id: 5,
    entity: "Colombo South",
    companyName: "E",
    industry: "Cosmetics",
    producttype: "IGTe",
    label: "EntityPartner",

  },
];

const ProspectsPage = () => {
  const handleButtonClick = () => {
    router.push("/dashboard/prospect/submit_request");
  };

  const [prospects] = useState(initialProspects);
  const [searchTerm, setSearchTerm] = useState("");

  const [industry, setIndustry] = useState("");
  const [product, setProduct] = useState("");
  const [lable, setLable] = useState("");
  const [entity, setEntity] = useState("");

  const entityColors: { [key: string]: string } = {
    "Colombo South": "bg-blue-500",
    "Colombo North": "bg-yellow-500",
    "Colombo Central": "bg-orange-500",
    "Jayawardenapura": "bg-red-500",
    "Rajarata": "bg-purple-500",
    "Ruhuna": "bg-pink-500",
    "NIBM": "bg-teal-500",
    "NSBM": "bg-green-500",
    "SLIIT": "bg-indigo-500",
    "Kandy": "bg-gray-500",
    "MC": "bg-lime-500",
    "MC 01": "bg-emerald-500",
    "MC 02": "bg-cyan-500",
    "MC 03": "bg-sky-500",
  };

  const labelColors: { [key: string]: string } = {
    Prospect: "bg-orange-400 text-white",   
    Promoter: "bg-red-500 text-white",   
    Customer: "bg-cyan-800 text-white",      
    EntityPartner: "bg-teal-600 text-white",       
  };

  // Filter prospects based on search term and other filters
  const filteredProspects = prospects.filter((prospect) => {
    const companyName = prospect.companyName
      ? prospect.companyName.toLowerCase()
      : "";
    const entityName = prospect.entity ? prospect.entity.toLowerCase() : "";
    const industryMatch = industry ? prospect.industry === industry : true;
    const productMatch = product ? prospect.producttype === product : true;
    const lableMatch = lable ? prospect.label === lable : true;
    const entityMatch = entity ? prospect.entity === entity : true;

    const searchMatch = companyName.includes(searchTerm.toLowerCase()) || entityName.includes(searchTerm.toLowerCase());

  return searchMatch && industryMatch && productMatch && lableMatch && entityMatch;

  });

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Partnerships</h1>

      <Button
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Create New Prospect
      </Button>

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
          <option value="Multi National">Multi National</option>
          <option value="NGO">NGO</option>
          <option value="Tourism">Tourism</option>
          <option value="Construction">Construction</option>
          <option value="FMCG">FMCG</option>
          <option value="Health Services">Health Services</option>
          <option value="Beauty and cosmetics">Beauty and cosmetics</option>
          <option value="Advertising and marketing">Advertising and marketing</option>
          <option value="Automobile">Automobile</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Telecommunication">Telecommunication</option>
          <option value="Banking and financial institutions">Banking and financial institutions</option>
          <option value="Transportation">Transportation</option>
          <option value="Insurance">Insurance</option>
          <option value="Congomerate">Congomerate</option>
          <option value="Shipping and Logistics">Shipping and Logistics</option>
          <option value="Design and Architecture">Design and Architecture</option>
          <option value="Goverment institutes">Goverment institutes</option>
       </select>

        {/* Product Filter  */}
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

          {/* Add other products here */}
        </select>

        {/* Stage Filter */}
        <select
          value={lable}
          onChange={(e) => setLable(e.target.value)}
          className="border rounded p-2 md:w-1/4 mb-4"
        >
          <option value="">Select Stage</option>
          <option value="Unoccupied">Unoccupied</option>
           <option value="Prospect">Prospect</option>
           <option value="Lead">Lead</option>
           <option value="Customer">Customer</option>
           <option value="Promoter">Promoter</option>
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
          <option value="Ruhuna">Ruhuna</option>
          <option value="NIBM">NIBM</option>
          <option value="NSBM">NSBM</option>
          <option value="SLIIT">SLIIT</option>
          <option value="Kandy">Kandy</option>
          <option value="MC">MC</option>
          <option value="MC 01">MC 01</option>
          <option value="MC 02">MC 02</option>
          <option value="MC 03">MC 03</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Product Type</TableHead>
            {/* <TableHead>Status</TableHead> */}

          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProspects.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell>{prospect.companyName}</TableCell>
              <TableCell className="relative">
                <div className={`rounded-lg ${entityColors[prospect.entity]} text-white text-lg font-normal px-4 py-6`}>
                  {prospect.entity}
                </div>
                <span className={`${labelColors[prospect.label] || labelColors.default} absolute top-4 right-0 text-xs rounded font-bold px-1`}>
                  {prospect.label}
                </span>
              </TableCell>
              <TableCell>{prospect.industry}</TableCell>
              <TableCell>{prospect.producttype}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProspectsPage;
