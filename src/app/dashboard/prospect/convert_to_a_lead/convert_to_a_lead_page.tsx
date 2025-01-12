"use client";
export const dynamic = "force-dynamic";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToastNotification from '@/app/components/ui/toast';
import { Label } from '@/app/components/ui/label';
import ProgressBar from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import ListGroup from '@/app/components/ui/list_groups';
import styles from "./styles.module.css";
import { v4 as uuidv4 } from 'uuid';
import { LEAD_BAR_COLOR, LEAD_BAR_WIDTH, LEAD_EXPIRE_TIME_DURATION, PROSPECT_BAR_COLOR, PROSPECT_BAR_WIDTH, PROSPECT_VALUES } from '@/app/lib/values';
import { useAuth } from '@/app/context/AuthContext';
import { link } from 'fs';

interface Product {
  _id: string;
  productName: string;
}

export default function ConvertToALeadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  interface ProspectDetails {
    date_expires: string;
    company_name: string;
    product_type_id: string;
    entity_id: string;
  }

  const [prospectDetails, setProspectDetails] = useState<ProspectDetails | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [sharedLink, setSharedLink] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('Example Company');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [progressBar, setProgressBar] = useState({
    text: PROSPECT_VALUES[1].label,
    color: PROSPECT_BAR_COLOR,
    width: PROSPECT_BAR_WIDTH,
  });
  const [isConverted, setIsConverted] = useState(false);

  const {user} = useAuth();
  const[lc_name, setLc_name] = useState<string>("");
  const [lc_color, setLc_color] = useState<string>("");
   const [productTypeName, setProductTypeName] = useState<String>("");
  const [stage, setStage] = useState('');

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
          setLc_name(data.lc_name || "");
                  setLc_color(data.lc_color || "");
                  setProductTypeName(data.product_type_name || "");
                  setStage("prospect");

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

  const getProductNameById = (id: string | null): string => {
  if (!id) return 'Unknown Product';
  
  const product = products.find((prod) => prod._id === id);
  
  if (!product) {
    console.warn(`Product with ID ${id} not found.`);
    return 'Unknown Product';
  }
  
  return product.productName;
};


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0] || null;
  setUploadedFile(file);

  if (file) {
    const { type } = file;
    if (type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else if (type === 'application/pdf') {
      setPreviewUrl('/pdf_icon.png'); // Fallback preview for PDFs
    } else {
      console.warn('Unsupported file type:', type);
      setPreviewUrl(null);
    }
  } else {
    setPreviewUrl(null);
  }

  
  try {
    // Get access token
   
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(`Upload failed: ${err.response?.data?.message || err.message}`);
      console.error('Upload error:', err.response?.data);
    } else if (err instanceof Error) {
      setError(`Upload failed: ${err.message}`);
      console.error('Upload error:', err);
    } else {
      setError('Upload failed: An unknown error occurred.');
      console.error('Upload error:', err);
    }
  } finally {
    setUploading(false);
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
    
    setUploading(true);
    
    try {
      const currentDate = new Date();
      const expireDate = new Date(currentDate.getTime() + LEAD_EXPIRE_TIME_DURATION);



      const tokenResponse = await axios.post('/api_new/fileuploadauth');
      const accessToken = tokenResponse.data.access_token;
  
      console.log('Access token obtained');
  
      const uniqueFileName = `${uuidv4()}-${uploadedFile?.name}`;
      //file.name = uniqueFileName;
      // Initialize upload session with site ID
      const sessionResponse = await axios.post(
  
  
        `https://graph.microsoft.com/v1.0/drive/root:/documents/${uniqueFileName}:/createUploadSession`,
        {
          item: {
            '@microsoft.graph.conflictBehavior': 'replace',
            name: uniqueFileName,
            'file': {}
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        }
      );
  
      const uploadUrl = sessionResponse.data.uploadUrl;
      const fileContent = await uploadedFile?.arrayBuffer();
  
      console.log('Upload URL:', uploadUrl);
  
      // Upload the file
      const uploadResponse = await axios.put(
        uploadUrl,
        fileContent,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': `${uploadedFile?.size}`,
            'Content-Range': `bytes 0-${uploadedFile ? uploadedFile.size - 1 : 0}/${uploadedFile ? uploadedFile.size : 0}`
          },
        }
      );
  
      if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
  
        
        const fileUrl = uploadResponse.data.webUrl;
  
        const fileId = uploadResponse.data.id;  // Get the uploaded file's ID
        console.log('File uploaded:', fileId);
  
        // Create a shareable link for the file (with view permissions)
        const linkResponse = await axios.post(
          `https://graph.microsoft.com/v1.0/drive/items/${fileId}/createLink`,
          {
            type: 'view',  // 'view' for read-only access, 'edit' for editable access
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          }
        );
  
        const shareLink = linkResponse.data.link.webUrl;  // The URL of the shareable link
        console.log('Shareable Link:', shareLink);
  setSharedLink(shareLink);
  console.log('Shared Link:', shareLink);
  console.log('Shared Link:', sharedLink);

  const payload = {
    id: prospectId,
    lead_proof_url: shareLink,
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


      if (response.ok && result.success) {
        console.log('Prospect updated successfully');
        setProgressBar({ text: PROSPECT_VALUES[2].label, color: LEAD_BAR_COLOR, width: LEAD_BAR_WIDTH });
        setIsConverted(true); // Mark as converted
        setStage("lead");
      } else {
        console.error('Failed to update prospect:', result.message || 'Unknown error');
      }

  const result = await response.json();

  if (response.ok && result.success) {
    console.log('Prospect updated successfully');
    setProgressBar({ text: PROSPECT_VALUES[2].label, color: LEAD_BAR_COLOR, width: LEAD_BAR_WIDTH });
    setIsConverted(true); // Mark as converted
  } else {
    console.error('Failed to update prospect:', result.message || 'Unknown error');
  }

  setSuccess('File uploaded successfully!');
} else {
  throw new Error(`Upload failed with status: ${uploadResponse.status}`);
}

if (isNaN(expireDate.getTime())) {
  throw new Error('Invalid expiration date calculated');
}

    

    } catch (error) {
      console.error('Error updating prospect:', error);
    }finally{
      setUploading(false);
    }
  };
  if (user?.lcId !== prospectDetails?.entity_id) {
    return <div className="container mx-auto p-4">Access Denied</div>;
  }else{
  return (
    <div className="container mx-auto pt-0 pb-20">
      <div className="w-full ml-4 mb-6 bg-gray-100 rounded overflow-hidden shadow-lg flex items-center pt-3 pb-3">
      <h1 className="text-2xl font-bold ml-4">
        <i className="fa-solid fa-handshake-simple mr-3"></i>
        {companyName + " - "}
        <span style={{ color: lc_color }}>{lc_name + " "}</span>
        <span style={{ color: stage === "prospect" ? PROSPECT_BAR_COLOR : LEAD_BAR_COLOR }}>
          {stage}
        </span>
        {" for " + productTypeName}
      </h1>
      </div>
      <div className="grid grid-cols-2 gap-16 pr-6">
        <div className="w-full ml-4 mt-5 pr-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6 ml-4"><i className="fa-regular fa-eye mr-3"></i>Convert Lead</h1>

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
              disabled={uploading}
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
               {uploading? 'Uploading...':'' }
              {isConverted ? 'Go Back' : ''}
              {!uploading && !isConverted ? 'Convert to Lead' : ''}
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
            <h1 className="text-2xl font-bold mb-6 ml-4"><i className="fa-solid fa-pencil mr-3"></i>Summary</h1>
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
}
