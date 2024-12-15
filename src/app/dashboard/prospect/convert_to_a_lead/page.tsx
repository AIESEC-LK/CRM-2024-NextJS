'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToastNotification from '@/app/components/ui/toast';
import { Label } from '@/app/components/ui/label';
import ProgressBar from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import ListGroup from '@/app/components/ui/list_groups';
import styles from "./styles.module.css";
import { LEAD_EXPIRE_TIME_DURATION } from '@/app/lib/values';

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
  const [progressBar, setProgressBar] = useState({
    text: 'Prospect',
    color: 'yellow',
    width: '30%',
  });
  const [isConverted, setIsConverted] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProspectId(id);
    }
  }, [searchParams]);

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

  const getProductNameById = (id: string | null) => {
    const product = products.find((prod) => prod._id === id);
    return product ? product.productName : '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);

    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewUrl('/pdf_icon.png');
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleActivityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.endsWith('/')) {
      const newActivity = value.slice(0, -1).trim();
      if (newActivity) {
        setActivities((prevActivities) => [...prevActivities, newActivity]);
        event.target.value = '';
      }
    }
  };

  const handleCloseToast = (index: number) => {
    setActivities((prevActivities) => prevActivities.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setActivities([]);
    const fileInput = document.getElementById('proof') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleConvert = async () => {
    if (!prospectId) {
      console.error('Prospect ID is not available for conversion');
      return;
    }

    try {
      const currentDate = new Date();
      const expireDate = new Date(currentDate.getTime() + LEAD_EXPIRE_TIME_DURATION);

      if (isNaN(expireDate.getTime())) {
        throw new Error('Invalid expiration date calculated');
      }

      const payload = {
        id: prospectId,
        lead_proof_url: '/partnership.jpg',
        activities: activities.length > 0 ? activities : [],
        status: 'lead',
        date_expires: expireDate.toISOString(),
      };

      const response = await fetch('/api_new/prospects/update_a_prospect', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Prospect updated successfully');
        setProgressBar({ text: 'Lead', color: 'blue', width: '60%' });
        setIsConverted(true); // Mark as converted
      } else {
        console.error('Failed to update prospect:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating prospect:', error);
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
              onClick={isConverted ? () => router.push('/dashboard/prospect/prospects') : handleConvert}
              className={`${
                isConverted ? 'bg-green-500 hover:bg-green-400' : 'bg-blue-500 hover:bg-blue-400'
              } text-white font-bold py-2 px-4 rounded ml-4 mb-8`}
            >
              {isConverted ? 'Go Back' : 'Convert to a Lead'}
            </button>

            {!isConverted && (
              <button
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded ml-4 mb-8"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6 ml-4">Summary</h1>
            <div className="pl-4 pr-4">
              <Label htmlFor="status">Status:</Label>
              <ProgressBar
                text={progressBar.text}
                color={progressBar.color}
                width={progressBar.width}
                className="mt-4 mb-4"
              />
              <Label htmlFor="expire-date">Expire Date:</Label>
              <Input
                placeholder={prospectDetails?.date_expires ? new Date(prospectDetails.date_expires).toLocaleDateString() : 'N/A'}
                className={`w-full mt-5 ${styles.mr4} mb-4`}
                type="text"
                disabled
              />
              <Label htmlFor="activities">Activities:</Label>
              <ListGroup
                values={activities.length > 0 ? activities : ['No activities recorded']}
                className="mt-4 mb-4"
              />
              <Label htmlFor="proof">Proof Document:</Label>
              {previewUrl && (
                <div className="mt-2">
                  {previewUrl.endsWith('.pdf') ? (
                    <img src="/pdf_icon.png" alt="PDF Proof" className="w-24 h-24 object-cover" />
                  ) : (
                    <img src={previewUrl} alt="Proof Document" className="w-24 h-24 object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
