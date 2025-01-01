"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { PARTNERHSIPS_UI_PATH } from "./lib/values";
import { useAuth } from "./context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add login logic here if needed
    router.push(PARTNERHSIPS_UI_PATH);

    //Mock user login
    const mockUser = { email: 'ashanmatheesha@gmail.com', role: "member" as "member", lcId: '675dbabf296393f677c5cf21' }
    login(mockUser);
  };

  return (
      <div
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gray-900"></div>
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
        </div>
      </div>
  );
};

export default LoginPage;