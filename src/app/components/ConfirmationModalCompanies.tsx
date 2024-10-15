// ConfirmationModal.tsx
import React from "react";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { BULK_COMPANY_STATUSES } from "../lib/values";

interface ConfirmationModalCompaniesProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: string; // Action could be "approve" or "decline"
  values: any;
}

const ConfirmationModalCompanies: React.FC<ConfirmationModalCompaniesProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  values
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h2 className="text-lg font-bold mb-4">
          Are you sure you want to {action} this company?
        </h2>
        {action === "edit" && (
          <>
            <Input placeholder="Company Name" className="mb-4" value={values.company_name}/>
            <Input placeholder="Company Email" className="mb-4" value={values.company_email}/>
            <Input placeholder="Company Phone" className="mb-4" value={values.company_phone}/>
            <Input placeholder="Company Address" className="mb-4" value={values.company_address}/>
            <Select options={BULK_COMPANY_STATUSES}/>
          </>

        )}
        <br/>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalCompanies;
