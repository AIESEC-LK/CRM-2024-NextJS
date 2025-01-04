"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { useAuth } from "@/app/context/AuthContext";

// Define label color schema
const labelColors: { [key: string]: string } = {
  prospect: "bg-orange-400 text-white",
  promoter: "bg-red-500 text-white",
  customer: "bg-indigo-800 text-white",
  entityPartner: "bg-teal-600 text-white",
  lead: "bg-yellow-400 text-white",
  customerPending: "bg-gray-800 text-white",
};

const ProspectsPage = () => {
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<any[]>([]);
  const [expandedEntity, setExpandedEntity] = useState<number | null>(null);
  const { user } = useAuth();

  // Filter states
  const [companyFilter, setCompanyFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch prospects from the API
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch("/api_new/prospects/get_all_prospects");
        if (!response.ok) {
          throw new Error("Failed to fetch prospects");
        }
        const data = await response.json();
        setProspects(data);
        setFilteredProspects(data);
      } catch (error) {
        console.error("Error fetching prospects:", error);
      }
    };

    fetchProspects();
  }, []);

  // Filter prospects whenever filter values change
  useEffect(() => {
    let filtered = [...prospects];

    // Company name filter
    if (companyFilter) {
      filtered = filtered.filter(prospect =>
        prospect.company_name.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    // Product type filter
    if (productFilter) {
      filtered = filtered.filter(prospect =>
        prospect.product_type_name === productFilter
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(prospect =>
        prospect.status === statusFilter
      );
    }

    // Entity filter
    if (entityFilter) {
      filtered = filtered.filter(prospect =>
        prospect.lc_name === entityFilter
      );
    }

    setFilteredProspects(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [companyFilter, productFilter, statusFilter, entityFilter, prospects]);

  const handleRowClick = (id: number) => {
    setExpandedEntity((prev) => (prev === id ? null : id));
  };

  // Get unique product types, statuses, and entities for filter options
  const productTypes = Array.from(new Set(prospects.map(p => p.product_type_name)));
  const statusTypes = Array.from(new Set(prospects.map(p => p.status)));
  const entityTypes = Array.from(new Set(prospects.map(p => p.lc_name)));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProspects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Partnerships</h1>

      <Button
        onClick={() => router.push("/dashboard/prospect/submit_request")}
        className="bg-gray-800 hover:bg-gray-600 text-gray-100 mb-5"
      >
        Create New Prospect
      </Button>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by company name"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Products</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Stages</option>
          {statusTypes.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Entities</option>
          {entityTypes.map((entity) => (
            <option key={entity} value={entity}>
              {entity}
            </option>
          ))}
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Events</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((prospect) => (
            <TableRow
              key={prospect.id}
              onClick={() => handleRowClick(prospect.id)}
              className="cursor-pointer hover:bg-gray-200"
            >
              <TableCell>{prospect.company_name}</TableCell>

              {prospect.status === "entityPartner" ? (
                <TableCell colSpan={2} className="relative">
                  <div
                    className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                    style={{ backgroundColor: prospect.lc_color }}
                  >
                    {prospect.lc_name}
                    <span
                      className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status] || 'bg-gray-400 text-white'}`}
                      style={{ zIndex: 10 }}
                    >
                      {prospect.status}
                    </span>
                  </div>
                </TableCell>
              ) : (
                <>
                  <TableCell className="relative">
                    {prospect.product_type_name === "Event" && (
                      <div
                        className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                        style={{ backgroundColor: prospect.lc_color }}
                      >
                        {prospect.lc_name}
                        <span
                          className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status] || 'bg-gray-400 text-white'}`}
                          style={{ zIndex: 10 }}
                        >
                          {prospect.status}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="relative">
                    {prospect.product_type_name !== "Event" && (
                      <div
                        className="rounded-lg text-gray-900 text-lg font-normal px-4 py-4"
                        style={{ backgroundColor: prospect.lc_color }}
                      >
                        {prospect.lc_name}
                        <span
                          className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status] || 'bg-gray-400 text-white'}`}
                          style={{ zIndex: 10 }}
                        >
                          {prospect.status}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </>
              )}
              
              {prospect.entity_id === user?.lcId && (              
                <TableCell>
                  <>
                    {prospect.status === "prospect" && (
                      <Button
                        onClick={() => router.push(`/dashboard/prospect/convert_to_a_lead?id=${prospect._id}`)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        Convert to Lead
                      </Button>
                    )}
                    {prospect.status === "lead" && (
                      <Button
                        onClick={() => router.push(`/dashboard/prospect/lead_to_customer?id=${prospect._id}`)}
                        className="bg-cyan-800 hover:bg-cyan-700 text-white"
                      >
                        Convert to Customer Pending
                      </Button>
                    )}
                    {prospect.status === "promoter" && (
                      <Button
                        onClick={() => router.push(`/dashboard/prospect/promoter?id=${prospect._id}`)}
                        className="bg-red-800 hover:bg-red-700 text-white"
                      >
                        View Promoter
                      </Button>
                    )}
                    {prospect.status === "customerPending" && (
                      <Button
                        onClick={() => router.push(`/dashboard/prospect/customer_pending?id=${prospect._id}`)}
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        View Customer Pending
                      </Button>
                    )}
                    {prospect.status === "customer" && (
                      <Button
                        onClick={() => router.push(`/dashboard/prospect/customer?id=${prospect._id}`)}
                        className="bg-indigo-800 hover:bg-indigo-700 text-white"
                      >
                        View Customer
                      </Button>
                    )}
                  </>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProspects.length)} of {filteredProspects.length} entries
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              onClick={() => paginate(number)}
              className={`${
                currentPage === number
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {number}
            </Button>
          ))}
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProspectsPage;

