"use client";
export const dynamic = "force-dynamic";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select } from "@/app/components/ui/select";
import ProgressBar from "@/app/components/ui/progress";
//import ListGroup from "@/app/components/ui/list_groups";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import { LEAD_BAR_COLOR, LEAD_BAR_WIDTH, CUSTOMER_PANDING_BAR_COLOR, CUSTOMER_PANDING_BAR_WIDTH, PROSPECT_VALUES } from "@/app/lib/values";

import { formatDate } from "./functions";
import ListGroup from "@/app/components/ui/list_groups";


import { v4 as uuidv4 } from 'uuid';

  interface Product {
    _id: string;
    productName: string;
    abbravation: string;
}

export default function MakeALeadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companyName, setCompanyName] = useState(String);

  interface ProspectDetails {
    date_expires: string;
    company_name: string;
    product_type_id: string;
  }
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [partnershipCategoryName, setPartnershipCategoryName] = useState(String);
  const [leadMouStartDate, setLeadMouStartDate] = useState("");
  const [leadMouEndDate, setLeadMouEndDate] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [partnershipType, setPartnershipType] = useState('');
  const [amount, setAmount] = useState('');
  const [id, setId] = useState('');
  //const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [prospectDetails, setProspectDetails] = useState<ProspectDetails | null>(null);
const [uploading, setUploading] = useState(false);
const [isConverted, setIsConverted] = useState(false);
  const [progressBarText, setProgressBarText] = useState(PROSPECT_VALUES[2].label);
  const [progressBarColor, setProgressBarColor] = useState(LEAD_BAR_COLOR);
  const [progressBarWidth, setProgressBarWidth] = useState(LEAD_BAR_WIDTH);
  const [lc_name, setLc_name] = useState<string>("");
   const [lc_color, setLc_color] = useState<string>("");
   const [productTypeName, setProductTypeName] = useState<string>("");
  const [stage, setStage] = useState('');
  const [category, setCategory] = useState('');


  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setId(id);
      console.log(prospectDetails)
    }
    
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      const fetchProspectDetails = async () => {
        try {
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=${id}`);
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
        setLeadMouStartDate(formatDate(data.date_added) || "");
        setLeadMouEndDate(formatDate(data.date_expires) || "");
        setActivities(data.activities || []);
        setStage("lead");
        setCategory("Not set")
        } catch (error) {
          console.error('Error fetching prospect details:', error);
        }
      };

      fetchProspectDetails();
    } else {
      console.error('Prospect ID is not available');
    }
  }, [id]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api_new/products/get_all_products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  const resetForm = () => {
    setPartnershipCategoryName('');
    setLeadMouStartDate('');
    setLeadMouEndDate('');
    setPartnershipType('');
    setAmount('');
  };

  const handleSubmit = async () => {

    setUploading(true);

  try {
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
      //console.log('Shareable Link:', shareLink);

      const data = {
        id,
        partnershipCategoryName,
        leadMouStartDate,
        leadMouEndDate,
        partnershipType,
        status: 'customerPending',
        mouUrl: shareLink, // Hardcoded for now
        ...(partnershipType === 'monetary' && { amount }),
      };

      const response = await fetch('/api_new/prospects/update_a_prospect', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submitted successfully');
        setProgressBarText(PROSPECT_VALUES[3].label);
        setProgressBarColor(CUSTOMER_PANDING_BAR_COLOR);
        setProgressBarWidth(CUSTOMER_PANDING_BAR_WIDTH);
        setStage("Customer Pending");
        setCategory("set")
      } else {
        console.log(`Error: ${result.error}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    } else {
      console.log('An unknown error occurred');
    }
  }finally{
    setUploading(false)
    setIsConverted(true);
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    //setFile(selectedFile);

    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else if (fileType === 'application/pdf') {
        setFilePreview('/pdf_icon.png');
        setUploadedFile(selectedFile);
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };

  return (

    <div className="container mx-auto pt-0 pr-4 pb-20">
<div className="w-full ml-4 mb-6 bg-gray-100 rounded overflow-hidden shadow-lg flex items-center pt-3 pb-3">
  <h1 className="text-2xl font-bold ml-4">
    <i className="fa-solid fa-handshake-simple mr-3"></i>
    {companyName + " - "}
    <span style={{ color: lc_color }}>{lc_name + " "}</span>
    <span style={{ color: stage === "lead" ? LEAD_BAR_COLOR : CUSTOMER_PANDING_BAR_COLOR }}>
      {stage}
    </span>
    {" for " + productTypeName}
  </h1>
</div>


      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="w-full ml-4 mb-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6"><i className="fa-regular fa-eye mr-3"></i>Lead Details</h1>
            <Label htmlFor="name" className="block mb-2">Company Name:</Label>
            <Input
              placeholder="Company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full mb-4"
              type="text"
              disabled
            />
            <Label htmlFor="product" className="block mb-2">Product:</Label>
            <Select
              options={products.map(product => ({
                value: product._id,
                label: `${product.productName} (${product.abbravation})`
              }))}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full ml-4 mb-6 bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6"><i className="fa-solid fa-pencil mr-3"></i>Summery</h1>
            <Label htmlFor="Status" className="block mb-2">Status:</Label>
            <ProgressBar text={progressBarText} color={progressBarColor} width={progressBarWidth} />
          </div>
        </div>
      </div>

      {/* Single Row for Stages */}
      <div className="grid grid-cols-3 gap-6 pl-4">
        {/* Active Stage - Customer */}
        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6"><i className="fa-solid fa-fire mr-3"></i>Active Stage</h1>
            <Label htmlFor="category" className="block mb-2">Category:</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-4"
              type="text"
              disabled
            />
          </div>
        </div>

        {/* Prospect Stage */}
        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6"><i className="fa-solid fa-car-side mr-3"></i>Prospect Stage</h1>
            <Label htmlFor="companyName" className="block mb-2">Activities:</Label>
            {
            <ListGroup
              values={activities.length > 0 ? activities : ['No activities recorded']}
              className="mt-4 mb-4"
            />}
          </div>
        </div>

        {/* Lead Stage */}
        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h1 className="text-2xl font-bold mb-6"><i className="fa-solid fa-chart-gantt mr-3"></i>Lead Stage</h1>
            <Label htmlFor="partnershipType" className="block mb-2">Partnership Type:</Label>
            <Select
              value={partnershipType}
              onChange={(e) => setPartnershipType(e.target.value)}
              className="w-full mb-4"
              options={[
                { value: 'monetary', label: 'Monetary' },
                { value: 'inkind', label: 'In-Kind' }
              ]}
            />
            {partnershipType === 'monetary' && (
              <>
                <Label htmlFor="amount" className="block mb-2">Amount:</Label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mb-4"
                  type="text"
                />
              </>
            )}
            <Label htmlFor="mou" className="block mb-2">MOU:</Label>
            <Input
              placeholder="YYYY/MM/DD"
              className="w-full mb-4"
              type="file"
              onChange={handleFileChange}
            />
            {filePreview && (
              <div className="mb-4">
                {filePreview.endsWith('.png') ? (
                  <Image src={filePreview} alt="PDF Icon" width={50} height={50} />
                ) : (
                  <Image src={filePreview} alt="File Preview" width={100} height={100} />
                )}
              </div>
            )}
            <Label htmlFor="mouStart" className="block mb-2">MOU Start Date:</Label>
            <Input
              placeholder="YYYY/MM/DD"
              value={leadMouStartDate}
              onChange={(e) => setLeadMouStartDate(e.target.value)}
              className="w-full mb-4"
              type="date"
            />
            <Label htmlFor="mouEnd" className="block mb-2">MOU End Date:</Label>
            <Input
              placeholder="YYYY/MM/DD"
              value={leadMouEndDate}
              onChange={(e) => setLeadMouEndDate(e.target.value)}
              className="w-full mb-4"
              type="date"
            />

            <Button 
             
              onClick={isConverted ? () => router.push('/dashboard/prospect/prospects') :handleSubmit}
              disabled={uploading}
              className={`${
                isConverted ? 'bg-green-500 hover:bg-green-400' : 'bg-blue-500 hover:bg-blue-400'
              } text-white font-bold py-2 px-4 rounded ml-4 mb-8`}
            >
                   {uploading? 'Uploading...':'' }
              {isConverted ? 'Go Back' : ''}
              {!uploading && !isConverted ? 'Convert to Customer' : ''}
            </Button>
            <Button 
              className="bg-gray-400 text-gray-900 px-4 py-2 rounded-md ml-4"
              onClick={resetForm}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

