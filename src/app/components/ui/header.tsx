'use client'
import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";



const Header = () => {

  const router = useRouter();
const [name,setName] = useState("")
  useEffect(() => {

const fetchName = async () => {

  try {
    const response = await fetch('/api_new/cookie/get_full_name');
    const data = await response.json();
    
    setName(data.full_name);
    console.log(data);
    console.log(name);

  } catch (error) {
    console.error('Error fetching email:', error);

}
}

fetchName();

  }, []);


  const HandleLogOut = async () => {
    try {
      const response = await fetch(`https://auth.aiesec.org/users/sign_out`, {
        method: 'GET',  
      
      });
  
      if (response.ok) {

        await fetch('/api_new/cookie/clear_cookies', {

          method: 'DELETE',
        });
        router.push('/');
        console.log('Logout successful');
      
      } else {
        console.log(response);
        throw new Error('Logout failed'); 
      }
  
    } catch (error) {
      console.error('Error logging out:', error);

    }
  };
 

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
              {name ? name.charAt(0) : ''}
            </div>
            <span>{name}</span>
          </div>
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700" onClick={HandleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};


export default Header;
