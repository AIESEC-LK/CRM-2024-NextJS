'use client'

//import { useState } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import ListGroup from '@/app/components/ui/list_groups'
import ToastNotification from '@/app/components/ui/toast'
import styles from "./styles.module.css"
import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';


interface Product {
  _id: string;
  productName: string;
}

export default function EditLead() {

    const [prospectDetails, setProspectDetails] = useState<any>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [activities, setActivities] = useState<string[]>([]);
    const [companyName, setCompanyName] = useState('Example Company');
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [stages , setStages] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [prospectId, setProspectId] = useState<string | null>(null);
  const [progressBar] = useState({
    text: 'Lead',
    color: 'red',
    width: '40%',
  })


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api_new/products/get_all_products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {

    const fetchstages = async () => {



      try {
        const response = await fetch('/api_new/stages/get_all_stages');
        if (!response.ok) {
          throw new Error('Failed to fetch stages');
        }
        const data = await response.json();
        setStages(data);
      } catch (error) {
        console.error('Error fetching stages:', error);
      }
    }
    fetchstages();


  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded">
              A
            </div>
            <h1 className="text-xl font-medium">AIESEC Sri Lanka Partners CRM</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
              Y
            </div>
            <span>Yasanjith Rajapathirane</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Partnership Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium">MC 01 - Chartered Institute of Personnel Management (CIPM) Partnership</h2>
            <p className="text-sm text-muted-foreground">for Events</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded">
              End Partnership
            </button>
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
              Delete Partnership
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-4 mb-6">
        <ProgressBar
            text={progressBar.text}
            color={progressBar.color}
            width={progressBar.width}
          />
        </div>

        {/* Active Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Active Stage - Lead</h3>
          <ToastNotification
            message="Final due date to go to the customer stage - 2024-11-19"
            onClose={() => {}}
          />
        </div>

        {/* Product Selection */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Overwrite Product of The Partnership</h3>
          <select className="w-full p-2 border rounded mb-4">
            <option>Select a Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productName}
            </option>
          ))}
          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            SWAP PRODUCT
          </button>
        </div>

        {/* Partnership Details */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Overwrite Partnership Details</h3>
          <select className="w-full p-2 border rounded mb-6">
            <option>Select An Stage</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}

          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-6">
            OVERWRITE STAGE
          </button>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Prospect Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-10-18"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Prospect Final Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-10-19"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Lead Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-11-18"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Lead Final Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-11-19"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6">
            OVERWRITE DATES
          </button>
        </div>

        {/* Prospect Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Prospect Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Remark by entity members</Label>
              <p className="text-sm text-muted-foreground mt-2">Confirmation</p>
            </div>
            <div>
              <Label>Proof Document</Label>
              <img 
                src="/placeholder.svg?height=200&width=400" 
                alt="Proof Document"
                className="mt-2 rounded-lg border"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>© AIESEC Sri Lanka 2019 - 2022</p>
        <p>Powered by TheAITeam</p>
      </footer> */}
    </div>
  )
}

