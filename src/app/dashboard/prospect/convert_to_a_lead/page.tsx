'use client';

import { useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select } from "@/app/components/ui/select";
import styles from "./styles.module.css";
import ProgressBar from "@/app/components/ui/progress";
import ListGroup from "@/app/components/ui/list_groups";
import Image from "next/image";
import ToastNotification from "@/app/components/ui/toast"; // Assume you have this component

export default function MakeALeadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("Example Company");
  const [selectedProduct, setSelectedProduct] = useState("igv");

  const activityInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleActivityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.endsWith("/")) {
      const newActivity = value.slice(0, -1).trim();
      if (newActivity) {
        setActivities((prevActivities) => [...prevActivities, newActivity]);
        event.target.value = ""; // Clear input
        activityInputRef.current?.focus(); // Auto-scroll and focus
      }
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setActivities([]);
    setCompanyName("Example Company");
    setSelectedProduct("igv");
  };

  const handleRemoveActivity = (index: number) => {
    setActivities((prevActivities) =>
      prevActivities.filter((_, i) => i !== index)
    );
  };

  const renderUploadedFile = () => {
    if (uploadedFile) {
      const fileType = uploadedFile.type;
      if (fileType === "application/pdf") {
        return (
          <Image
            src="/pdf_icon.png"
            alt="PDF Icon"
            width={100}
            height={100}
            className="ml-4 mt-5 mb-4 mr-4"
          />
        );
      } else if (fileType.startsWith("image/")) {
        return (
          <Image
            src={URL.createObjectURL(uploadedFile)}
            alt="Uploaded Image"
            width={100}
            height={100}
            className="ml-4 mt-5 mb-4 mr-4"
          />
        );
      }
    }
    return null;
  };

  return (
    <>
      <div className="container mx-auto pt-0">
        <h1 className="text-2xl font-bold mb-6 ml-4">Lead Conversion</h1>
        <div className="grid grid-cols-2 gap-16 pr-6">
          {/* Convert Lead Section */}
          <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <h1 className="text-2xl font-bold mb-6 ml-4">Convert Lead</h1>
              <Label htmlFor="name" className="ml-4 mr-4">
                Company Name:
              </Label>
              <Input
                placeholder="Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`w-full ml-4 mt-5 ${styles.mr4} mb-4`}
                type="text"
                disabled
              />

              <Label htmlFor="name" className="ml-4 mr-4">
                Product:
              </Label>
              <Select
                options={[
                  { value: "igv", label: "iGV" },
                  { value: "igt", label: "iGT" },
                  { value: "ogv", label: "oGV" },
                  { value: "ogt", label: "oGT" },
                ]}
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full ml-4 mt-5 mr-4 mb-4"
                disabled
              />

              <Label htmlFor="proof" className="ml-4">
                Proof Document:
              </Label>
              <Input
                id="proof"
                placeholder="Select your Proof"
                className="w-full ml-4 mt-5 mb-4 mr-4"
                type="file"
                accept="image/*, .pdf"
                onChange={handleFileChange}
              />
              {renderUploadedFile()}

              <Label htmlFor="activities" className="ml-4 mr-4">
                Activities:
              </Label>

              {activities.map((activity, index) => (
                <div className="pl-4 pr-4" key={index}>
                  <ToastNotification
                    message={activity}
                    onClose={() => handleRemoveActivity(index)}
                  />
                </div>
              ))}

              <Input
                id="activities"
                placeholder="Enter / for a new activity"
                onChange={handleActivityInput}
                className={`w-full ml-4 mt-5 ${styles.mr4} mb-8`}
                type="text"
                ref={activityInputRef}
              />

              <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8">
                Convert to a Lead
              </Button>
              <Button
                className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
            <div className="px-14 py-14">
              <h1 className="text-2xl font-bold mb-6 ml-4">Summary</h1>
              <div className="pl-4 pr-4">
                <Label htmlFor="status">Status:</Label>
                <ProgressBar
                  text={"Lead"}
                  color={"blue"}
                  width={"60%"}
                  className="mt-4 mb-4"
                />

                <Label htmlFor="expire-countdown">Expire Countdown:</Label>
                <ProgressBar
                  text={"90 days remaining"}
                  color={"green"}
                  width={"90%"}
                  className="mt-4 mb-4"
                />

                <Label htmlFor="expire-date">Expire Date:</Label>
                <Input
                  placeholder="26/12/2024"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                  type="text"
                  disabled
                />

                <Label htmlFor="activities">Activities: </Label>
                <ListGroup
                  values={["Activity 1", "Activity 2"]}
                  className="mt-4 mb-4"
                />

                <Label htmlFor="proof">Proof Document: </Label>
                {uploadedFile?.type === "application/pdf" && (
                  <Image
                    src="/pdf_icon.png"
                    alt="PDF Icon"
                    width={100}
                    height={100}
                    className="ml-4 mt-5 mb-4 mr-4"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
