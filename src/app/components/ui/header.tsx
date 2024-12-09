import React from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between pl-4 pr-4">
        <h1 className="text-xl font-bold cursor-pointer">
          <Link href={"/"}>AIESEC Partner CRM</Link>
        </h1>
        <div className="flex items-center space-x-4">
          <span>Admin Name</span>
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};


export default Header;
