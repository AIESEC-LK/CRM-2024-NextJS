"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
//import { useAuth } from "@/app/context/AuthContext";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F06292",
  "#AED581",
  "#FFD54F",
  "#4DB6AC",
  "#7986CB",
  "#7D9AE9",
];

export default function AddEntityPage() {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const router = useRouter();
//const { user } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api_new/entities/add_an_entity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entityName: name, color: color }),
      });
      if (!response.ok) {
        throw new Error("Failed to add entity");
      }
      router.push("/dashboard/entities");
    } catch (error) {
      console.error("Error adding entity:", error);
    }
  };

  /*
  if (user?.role !== "admin") {
    return <div className="container mx-auto p-4">Access Denied</div>;
  }else{*/
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add New Entity</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Entity Name</Label>
            <Input
              className="mt-2 mb-4"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
         
          <div>
            <Label htmlFor="color">Entity Color</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full ${
                    color === c ? "ring-2 ring-offset-2 ring-black" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  id="color"
                  value={color}
                  title={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="bg-gray-600 hover:bg-gray-500 mt-4">
            Add Entity
          </Button>
        </form>
      </div>
    );

  }

  
//}
