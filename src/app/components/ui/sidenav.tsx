import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBullhorn,
  faQuestion,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { PARTNERHSIPS_UI_PATH } from "@/app/lib/values";

const SideNav = () => {
  return (
    <nav className="h-full bg-gray-800 text-white">
      <ul className="space-y-4 p-4">
        <li>
          <Link
            href={PARTNERHSIPS_UI_PATH}
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
            Partnerships
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            Prospect Requests (Admin)
          </span>
        </li>
        <li>
          <Link
            href="/dashboard/admin"
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
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
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
            Submit Prospect Req
            <FontAwesomeIcon
              icon={faBullhorn}
              className="h-6 w-6"
              title="Update Leads"
            />
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/update_leads"
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
            Update Leads
            <FontAwesomeIcon
              icon={faBullhorn}
              className="h-6 w-6"
              title="Update Leads"
            />
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/entities"
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
            Entities
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/help"
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon
              icon={faQuestion}
              className="h-6 w-6"
              title="Update Leads"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
