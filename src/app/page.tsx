"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { PARTNERHSIPS_UI_PATH } from "./lib/values";
import { useAuth } from "./context/AuthContext";
import image from "../app/assets/giphy.gif"

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState(String);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add login logic here if needed
    router.push(PARTNERHSIPS_UI_PATH);

    //Mock user login
    login("ashanmatheesha@aiesec.net");

  };


  useEffect(() => {
    async function setEmail() {
      try {
        const response = await fetch('/api_new/cookie');
        const data = await response.json();
      
        if (data.email) {
         
          login(data.email);
          console.log(data);


            setTimeout(() => {
            router.push(PARTNERHSIPS_UI_PATH);
            }, 5000);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    }

    setEmail();
 
  }, []);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-black"
    >

      <div className="flex flex-col items-center justify-center">
        <Image
          src={image}
          alt="Loading"
          className="m-auto"
          width={480}
          height={271}
        />
        <h3 className="text-white mt-2 text-lg font-semibold">Creating Sustainable Partnerships...</h3>
      </div>

      {/* <div className="absolute inset-0 bg-gray-900"></div>
      <div className="relative w-full max-w-sm p-6 bg-white rounded-md shadow-2xl">
        <h1 className="text-2xl font-semibold text-center text-gray-800">Login</h1>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#037ef3] text-white hover:bg-[#0367c4]"
            >
              Login
            </Button>
            <Button
              type="reset"
              variant="outline"
              className="w-full bg-[#caccd1] text-gray-700 hover:bg-[#b8babc]"
            >
              Reset
            </Button>
          </div>
        </form>
      </div> */}
    </div>
  );
};

export default LoginPage;