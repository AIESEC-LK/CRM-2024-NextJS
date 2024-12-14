'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToastNotification from '@/app/components/ui/toast'; 
interface Product {
  _id: string;
  productName: string;
}

export default function MakeALeadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prospectDetails, setProspectDetails] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('Example Company');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [prospectId, setProspectId] = useState<string | null>(null);

  // Fetch the id parameter from the URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProspectId(id);
    }
  }, [searchParams]);

  // Fetch prospect details from the API when the prospectId is set
  useEffect(() => {
    if (prospectId) {
      const fetchProspectDetails = async () => {
        try {
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=${prospectId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch prospect details');
          }
          const data = await response.json();
          setProspectDetails(data);
          setCompanyName(data.company_name);
          setSelectedProduct(data.product_type_id);
        } catch (error) {
          console.error('Error fetching prospect details:', error);
        }
      };

      fetchProspectDetails();
    } else {
      console.error('Prospect ID is not available');
    }
  }, [prospectId]);

  // Fetch products from the API
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

  // Find product name based on selected product id
  const getProductNameById = (id: string | null) => {
    const product = products.find((prod) => prod._id === id);
    return product ? product.productName : '';
  };

  // Handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);

    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewUrl('/pdf_icon.png'); // Assuming pdf_icon.png is in the public folder
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle activity input and add activities when '/' is pressed
  const handleActivityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.endsWith('/')) {
      const newActivity = value.slice(0, -1).trim();
      if (newActivity) {
        setActivities((prevActivities) => [...prevActivities, newActivity]);
        event.target.value = ''; // Clear the input field after adding the activity
      }
    }
  };

  // Remove an activity when its toast close button is clicked
  const handleCloseToast = (index: number) => {
    setActivities((prevActivities) => prevActivities.filter((_, i) => i !== index));
  };

  // Reset form fields
  const handleReset = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setActivities([]); // Reset activities
    const fileInput = document.getElementById('proof') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle conversion button click and navigate to the conversion page
  const handleConvert = () => {
    if (prospectId) {
      router.push(`/dashboard/prospect/convert_to_a_lead?id=${prospectId}`);
    } else {
      console.error('Prospect ID is not available for conversion');
    }
  };

  return (
    <div className="container mx-auto pt-0">
      <h1 className="text-2xl font-bold mb-6 ml-4">Lead Conversion</h1>
      <div className="grid grid-cols-2 gap-16 pr-6">
        <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6 ml-4">Convert Lead</h1>

            <label htmlFor="company-name" className="ml-4 mr-4">
              Company Name:
            </label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              disabled
              className="w-full ml-4 mt-5 mb-4"
            />

            <label htmlFor="product" className="ml-4 mr-4">
              Product:
            </label>
            <select
              id="product"
              value={getProductNameById(selectedProduct)}
              disabled
              className="w-full ml-4 mt-5 mb-4"
            >
              <option value="">{getProductNameById(selectedProduct)}</option>
            </select>

            <label htmlFor="proof" className="ml-4">
              Proof Document:
            </label>
            <input
              id="proof"
              type="file"
              accept="image/*, .pdf"
              onChange={handleFileChange}
              className="w-full ml-4 mt-5 mb-4"
            />

            {previewUrl && (
              <div className="ml-4 mt-2 mb-4">
                {uploadedFile?.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover" />
                ) : (
                  <img src="/pdf_icon.png" alt="PDF Icon" className="w-24 h-24 object-cover" />
                )}
              </div>
            )}

            <label htmlFor="activities" className="ml-4 mr-4">
              Activities:
            </label>

            {/* Render a ToastNotification for each activity */}
            {activities.map((activity, index) => (
              <ToastNotification 
                key={index} 
                message={activity} 
                onClose={() => handleCloseToast(index)} 
              />
            ))}

            <input
              id="activities"
              type="text"
              placeholder="Enter / for a new activity"
              onChange={handleActivityInput}
              className="w-full ml-4 mt-5 mb-8"
            />

            <button
              onClick={handleConvert}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8"
            >
              Convert to a Lead
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
