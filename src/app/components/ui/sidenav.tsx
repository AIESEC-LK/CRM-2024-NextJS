'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";  // Import usePathname
import { PARTNERHSIPS_UI_PATH } from "@/app/lib/values";
import { useAuth } from "@/app/context/AuthContext";

const SideNav = () => {
  const pathname = usePathname();  // Get the current path
  const { user } = useAuth();

  // Helper function to check if the link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="h-full bg-gray-800 text-white overflow-y-auto">
      <ul className="space-y-4 p-4">
        <li>
          <Link
            href={PARTNERHSIPS_UI_PATH}
            className={`flex items-center justify-center p-4 rounded ${isActive(PARTNERHSIPS_UI_PATH) ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >
            Partnerships
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            Prospect Requests (Admin)
          </span>
        </li>
        <li>
          <Link
            href="/dashboard/prospect/queue"
            className={`flex items-center justify-center p-4 rounded ${isActive("/dashboard/prospect/queue") ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >
            Waiting List
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            Waiting List (Admin)
          </span>
        </li>
{user?.role === "admin" && (
  <>
  <li>
    <Link
      href="/dashboard/admin"
      className={`flex items-center justify-center p-4 rounded ${isActive("/dashboard/admin") ? "bg-gray-600" : "hover:bg-gray-700"
        }`}
    >
      MCVP Approval
    </Link>
    <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
      MCVP Approval (Admin)
    </span>
  </li>
  <li>
  <Link
    href="/dashboard/user/manage"
    className={`flex items-center justify-center p-4 rounded ${isActive("/dashboard/user/manage") ? "bg-gray-600" : "hover:bg-gray-700"
      }`}
  >
    User Management
  </Link>
  <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
  User Management (Admin)
  </span>
</li>
</>
  
)}
      
      </ul>
    </nav>
  );
};

export default SideNav;
