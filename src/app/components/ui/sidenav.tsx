import React from 'react';
import Link from 'next/link';

const SideNav = () => {
  return (
    <nav className="h-full bg-gray-800 text-white">
      <ul className="space-y-4 p-4">
        <li>
          <Link href="/dashboard/admin" className="block p-2 hover:bg-gray-700 rounded">
            Admin
          </Link>
        </li>
        <li>
          <Link href="/dashboard/update_leads" className="block p-2 hover:bg-gray-700 rounded">
            Update Leads
          </Link>
        </li>
        <li>
          <Link href="/dashboard/profile" className="block p-2 hover:bg-gray-700 rounded">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/dashboard/help" className="block p-2 hover:bg-gray-700 rounded">
            Help
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
