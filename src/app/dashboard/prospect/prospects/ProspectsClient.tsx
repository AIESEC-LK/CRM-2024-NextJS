'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { useAuth } from "@/app/context/AuthContext";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Prospect {


    _id: string;
    company_name: string;
    product_type_name: string;
    status: string;
    lc_name: string;
    lc_color: string;
    entity_id: string;
  
  }
  
  const labelColors: { [key: string]: string } = {
  
    prospect: "bg-orange-400 text-white",
    promoter: "bg-red-500 text-white",
    customer: "bg-indigo-800 text-white",
    entityPartner: "bg-teal-600 text-white",
    lead: "bg-yellow-400 text-white",
    customerPending: "bg-gray-800 text-white",
    customerPendingMoURejected: "bg-blue-500 text-white",
    mcvpap: "bg-blue-400 text-white",
  
  };

  
  

export default function ProspectsClient({ prospect_list }: { prospect_list : any }) {


    const router = useRouter();
      const [prospects, setProspects] = useState<Prospect[]>([]);
      const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
      const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
      const { user } = useAuth();
    
      // Filter states
      const [companyFilter, setCompanyFilter] = useState("");
      const [productFilter, setProductFilter] = useState("");
      const [statusFilter, setStatusFilter] = useState("");
      const [entityFilter, setEntityFilter] = useState("");
    
      // Pagination states
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(10);

      useEffect(() => {
        setProspects(prospect_list);
        setFilteredProspects(prospect_list);
      }, [prospect_list]);

      // Filter prospects whenever filter values change
  useEffect(() => {
    let filtered = [...prospects];

    if (companyFilter) {
      filtered = filtered.filter(prospect =>
        prospect.company_name?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (productFilter) {
      filtered = filtered.filter(prospect =>
        prospect.product_type_name === productFilter
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(prospect =>
        prospect.status === statusFilter
      );
    }

    if (entityFilter) {
      filtered = filtered.filter(prospect =>
        prospect.lc_name === entityFilter
      );
    }

    setFilteredProspects(filtered);
    setCurrentPage(1);
  }, [companyFilter, productFilter, statusFilter, entityFilter, prospects]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev: Record<string, boolean>) => {
      const newExpandedRows: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newExpandedRows[key] = false;
      });
      newExpandedRows[id] = !prev[id];
      return newExpandedRows;
    });
  };

  const GetStatusLabel = (status: string) => {
    const item = PROSPECT_VALUES.find((item) => item.value === status);
    return item?.label;
  };

  // Get unique values for filters
  const productTypes = Array.from(new Set(prospects.map(p => p.product_type_name)));
  const statusTypes = Array.from(new Set(prospects.map(p => p.status)));
  const entityTypes = Array.from(new Set(prospects.map(p => p.lc_name)));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProspects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const ProductBadge = ({ name }: { name: string }) => (
    <div className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-500 text-white mr-2">
      {name}
    </div>
  );
    
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
                  {GetStatusLabel(status)}
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
    
          {/* Prospects List */}
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700">
              <div>Company</div>
              <div>Event</div>
              <div>Products</div>
              <div className="text-right">Actions</div>
            </div>
    
            {currentItems.map((prospect) => (
              <div key={prospect._id} className="border-b last:border-b-0">
                <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50">
                  {/* Company Name Column */}
                  <div className="flex items-center">
                    <div 
                      onClick={() => toggleRow(prospect._id)}
                      className="cursor-pointer flex items-center"
                    >
                      <div className={`mr-2 transition-transform ${expandedRows[prospect._id] ? 'rotate-90' : ''}`}>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900">{prospect.company_name}</span>
                    </div>
                  </div>
    
                  {/* Event Products Column */}
                  <div className="relative">
                    {prospect.product_type_name === "Event" && (
                      <div
                        className="rounded-lg text-gray-900 text-sm font-normal px-3 py-2"
                        style={{ backgroundColor: prospect.lc_color }}
                      >
                        {prospect.lc_name}
                        <span className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status]}`}>
                          {prospect.status === "mcvpap" ? "MCVAP" : GetStatusLabel(prospect.status)}
                        
                        </span>
                      </div>
                    )}
                  </div>
    
                  {/* Other Products Column */}
                  <div className="relative">
                    {prospect.product_type_name !== "Event" && (
                      <div
                        className="rounded-lg text-gray-900 text-sm font-normal px-3 py-2"
                        style={{ backgroundColor: prospect.lc_color }}
                      >
                        {prospect.lc_name}
                        <span className={`absolute top-0 right-0 text-xs font-semibold py-1 px-2 rounded-tl-lg ${labelColors[prospect.status]}`}>
                        {prospect.status === "mcvpap" ? "MCVPAP" : GetStatusLabel(prospect.status)}
                        </span>
                      </div>
                    )}
                  </div>
    
                  {/* Actions Column */}
                  <div className="flex justify-end">
                    {prospect.entity_id === user?.lcId && user.role === "member" &&(
                      <div>
                        {prospect.status === "prospect" && (
                          <Button
                            onClick={() => router.push(`/dashboard/prospect/convert_to_a_lead?id=${prospect._id}`)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white"
                          >
                            <i className="fa fa-line-chart mr-3" aria-hidden="true"></i>Upgrade to Lead
                          </Button>
                        )}
                        {prospect.status === "lead" && (
                          <Button
                            onClick={() => router.push(`/dashboard/prospect/lead_to_customer?id=${prospect._id}`)}
                            className="bg-cyan-800 hover:bg-cyan-700 text-white"
                          >
                            <i className="fa fa-line-chart mr-3" aria-hidden="true"></i>Upgrade to Customer Pending
                          </Button>
                        )}
    {prospect.status === "customerPendingMoURejected" && (
                          <Button
                            onClick={() => router.push(`/dashboard/prospect/lead_to_customer?id=${prospect._id}`)}
                            className="bg-cyan-800 hover:bg-cyan-700 text-white"
                          >
                            <i className="fa fa-line-chart mr-3" aria-hidden="true"></i>Upgrade to Customer Pending
                          </Button>
                        )}
    
    
                        {prospect.status === "promoter" && (
                          <Button
                            onClick={() => router.push(`/dashboard/prospect/promoter?id=${prospect._id}`)}
                            className="bg-red-800 hover:bg-red-700 text-white"
                          >
                            <i className="fa fa-eye mr-3" aria-hidden="true"></i>View Promoter
                          </Button>
                        )}
                        {prospect.status === "customerPending" && (
                          <Button
                            onClick={() => router.push(`/dashboard/prospect/customer_pending?id=${prospect._id}`)}
                            className="bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            <i className="fa fa-eye mr-3" aria-hidden="true"></i>View Customer Pending
                          </Button>
                        )}
                        {prospect.status === "customer" && (
                          <Button
                            onClick={() => router.push(`/dashboard/prospect/customer?id=${prospect._id}`)}
                            className="bg-indigo-800 hover:bg-indigo-700 text-white"
                          >
                            <i className="fa fa-eye mr-3" aria-hidden="true"></i>View Customer
                          </Button>
                        )}
                        
                      </div>
                    )}
    
    
    
    {user?.role === "admin" &&(
                      <div>
                        <Button
                            onClick={() => router.push(`/dashboard/admin_view/Main?id=${prospect._id}`)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white"
                          >
                            <i className="fa fa-eye mr-3" aria-hidden="true"></i>View
                          </Button>                   
                      </div>
                    )}
                    
                  </div>
                </div>
                
                {/* Expanded content */}
                {expandedRows[prospect._id] && (
      <div className="col-span-4 bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 p-4 pl-11">
            <div className="space-y-2">
              <div className="font-medium text-sm text-gray-600">Products:</div>
              <div className="flex flex-wrap gap-2">
                {prospect.product_type_name && (
                  <ProductBadge name={prospect.product_type_name} />
                )}
              </div>
              <div className="text-sm text-gray-500">
                Status: {GetStatusLabel(prospect.status)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
              </div>
            ))}
          </div>
    
          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
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
