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
import ConfirmationModal from "@/app/components/ConfirmationModal";

interface Entity {
  _id: string;
  name: string;
  color: string;
}

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [entityToDelete, setEntityToDelete] = useState<Entity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDelete = (entity: Entity) => {
    setEntityToDelete(entity);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!entityToDelete) return;

    try {
      const response = await fetch(`/api/entities/${entityToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entity");
      }
      setEntities(
        entities.filter((entity) => entity._id !== entityToDelete._id)
      );
      setIsDeleteModalOpen(false);
      setEntityToDelete(null);
    } catch (error) {
      console.error("Error deleting entity:", error);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEntityToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Entities</h1>
      <Link href="/dashboard/add_entity">
        <Button className="mb-4 bg-slate-900 text-white hover:bg-slate-700">
          Add New Entity
        </Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "5%" }}></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity._id}>
              <TableCell>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: entity.color }}
                  aria-label={`Color: ${entity.color}`}
                />
              </TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(entity)}
                  className="bg-red-500 hover:bg-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        action="delete"
      />
    </div>
  );
}
