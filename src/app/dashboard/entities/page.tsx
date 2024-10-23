"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface Entity {
  _id: string;
  name: string;
}

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await fetch("/api/entities");
      if (!response.ok) {
        throw new Error("Failed to fetch entities");
      }
      const data = await response.json();
      setEntities(data);
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/entities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete entity");
      }
      setEntities(entities.filter((entity) => entity._id !== id));
    } catch (error) {
      console.error("Error deleting entity:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Entities</h1>
      <Link href={"add_entity"}>
        <Button className="mb-4 bg-slate-900 text-white hover:bg-slate-700">
          Add New Entity
        </Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity._id}>
              <TableCell>{entity.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(entity._id)}
                  className="bg-red-500 hover:bg-red-400 mr-20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
