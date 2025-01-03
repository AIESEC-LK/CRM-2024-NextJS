'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";  // Import usePathname
import { PARTNERHSIPS_UI_PATH } from "@/app/lib/values";

const SideNav = () => {
  const pathname = usePathname();  // Get the current path

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
        <li>
          <Link
            href="/dashboard/admin"
            className={`flex items-center justify-center p-4 rounded ${isActive("/dashboard/admin") ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >
            Prospect Requests
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            Prospect Requests (Admin)
          </span>
        </li>
        <li>
          <Link
            href="/dashboard/prospect"
            className={`flex items-center justify-center p-4 rounded ${isActive("/dashboard/prospect") ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >
            Submit Prospect Req
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/update_leads"
            className={`flex items-center justify-center p-4 rounded ${isActive("/dashboard/update_leads") ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >
            Update Leads
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/entities"
            className={`flex items-center justify p-4 rounded ${isActive("/dashboard/entities") ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >Entities</Link>
        </li>
        <li>
          <Link
            href="/dashboard/help"
            className={`flex items-center justify p-4 rounded ${isActive("/dashboard/help") ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
          >Help</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
