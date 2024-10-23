import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBullhorn,
  faQuestion,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const SideNav = () => {
  return (
    <nav className="h-full bg-gray-800 text-white">
      <ul className="space-y-4 p-4">
        <li>
          <Link
            href="/dashboard/admin"
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
            Prospect Requests
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/update_leads"
            className="flex items-center justify-center p-4 hover:bg-gray-700 rounded"
          >
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
