import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";


const Header = () => {



 

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between pl-4 pr-4">
      
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded">
              A
            </div>
            <h1 className="text-xl font-medium"> <Link href={"/dashboard/prospect/prospects"}>AIESEC Sri Lanka Partners CRM</Link></h1>
          </div>
        <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
            <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
              Y
            </div>
            <span>Yasanjith Rajapathirane</span>
          </div>
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};


export default Header;
