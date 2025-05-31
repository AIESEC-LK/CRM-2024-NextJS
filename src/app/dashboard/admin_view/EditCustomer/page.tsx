'use client'

import { useState,useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import styles from "./styles.module.css"
import { PROSPECT_BAR_COLOR, PROSPECT_BAR_WIDTH, PROSPECT_VALUES,CUSTOMER_PANDING_BAR_COLOR,CUSTOMER_PANDING_BAR_WIDTH,PROSPECT_EXPIRE_TIME_DURATION ,LEAD_EXPIRE_TIME_DURATION,LEAD_BAR_WIDTH,LEAD_BAR_COLOR ,CUSTOMER_BAR_COLOR,CUSTOMER_BAR_WIDTH} from '@/app/lib/values';
import ToastNotification from '@/app/components/ui/toast';
export default function EditCustomer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  interface ProspectDetails {
    date_expires: string;
    company_name: string;
    product_type_id: string;
  }

  interface Product {
    _id: string;
    productName: string;
  }

  interface Company {

    _id: string;
    companyName: string;
  }

  interface Entity{

    _id:string;
    entityName :string;
  }


  const [prospectDetails, setProspectDetails] = useState<ProspectDetails | null>(null);
  const [companyId, setCompanyId] = useState('Example Company');
  
  const[newProduct, setNewProduct] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]); 
  const [activities, setActivities] = useState<string[]>([]);
  const [entities,setEntites] = useState<Entity[]>([]);
  const [prospectEntity,SetprospectEntity] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
const [stages , setStages] = useState<string[]>([]);
const [proofDocument,setProofDocument] = useState<string | null>(null);
const [mouUrl,setMouUrl] = useState<Date>();
const [amount,setAmount] = useState<number | null>(null); 
const [mouStartDate,setMouStartDate] = useState<Date>();
const [mouEndDate,setMouEndDate] = useState<Date>();
const [category,setCategory] = useState<string | null>(null);
    
  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api_new/products/get_all_products',
          {
            headers: {
              "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
            },
          }
        );
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
        const response = await fetch('/api_new/stages/get_all_stages',
          {
            headers: {
              "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
            },
          }
        );
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

  useEffect(() => {
    if (true) {
      const fetchProspectDetails = async () => {
        try {
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=676964f5855d970eb0dd3717`,
            {
              headers: {
                "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
              },
            }
          );
          if (!response.ok) {
            throw new Error('Failed to fetch prospect details');
          }
          const data = await response.json();
          setProspectDetails(data);
          setCompanyId(data.company_id);
        
          setSelectedProduct(data.product_type_id);
          SetprospectEntity(data.entity_id)
          setCurrentStage(data.status);
          setActivities(data.activities);
          setProofDocument(data.lead_proof_url);
          setMouUrl(data.mouUrl);
          setAmount(data.amount);
          setMouStartDate(data.date_added);
          setMouEndDate(data.date_expires);
          setCategory(data.partnershipType);
   

   
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchProspectDetails();
    }
  }, [prospectId]); 


  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api_new/products/get_all_products',
          {
            headers: {
              "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
            },
          }
        );
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


  useEffect(()=>{

    const fetchAllEntities = async () =>{


      try {
        const response = await fetch('/api_new/entities/get_all_entities',
          {
            headers: {
              "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch entities');
        }
        const data = await response.json();
        setEntites(data);
      } catch (error) {
        console.error('Error fetching entities:', error);
      }

    }
    fetchAllEntities();
  },[])

  useEffect(() => {

    const fetchAllCompanies = async () => {
      try {
        const response = await fetch('/api_new/companies/get_all_companies',
          {
            headers: {
              "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    }

    fetchAllCompanies();

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


const getStageByValue = (value: string | null): string => {

  if (!value) return 'Unknown Stage';

  const stage = PROSPECT_VALUES.find((stage) => stage.value === value);

  if (!stage) {
    console.warn(`Stage with value ${value} not found.`);
    return 'Unknown Stage';
  }

  return stage.label;

}


const getCompanyNameById = (id: string | null): string => {
  if (!id) return 'Unknown Company';

  const company = companies.find((comp) => comp._id === id);

  if(!company){
    console.warn(`Company with ID ${id} not found.`);
    return 'Unknown Company';


  }

  return company.companyName;

}

const getEntityById = (id: string | null): string => {
  if (!id) return 'Unknown Entity';

  const entity = entities.find((ent) => ent._id === id);

  if(!entity){
    console.warn(`Entity with ID ${id} not found.`);
    return 'Unknown Entity';
  }
  return entity.entityName;
}

const [progressBar, setProgressBar] = useState({
  text: '',
  color: '',
  width: '',
});
const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const newProductId = event.target.value;
  setNewProduct(newProductId);
  console.log(newProductId);
};
const handleMouStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = new Date(event.target.value);
  setMouStartDate(newDate);
  console.log(newDate);

}

const handleMouEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = new Date(event.target.value);
  setMouEndDate(newDate);
  console.log(newDate);

}


const handleStageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const newStage = event.target.value;
  setCurrentStage(newStage);
  console.log(newStage);
}

const HandleSwapProduct = async () => {
  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
      },
      body: JSON.stringify({
        id: "676964f5855d970eb0dd3717",
        product_type_id: newProduct,
      }),
    });

    if (response.ok) {
      console.log('Product updated successfully');
      setSelectedProduct(newProduct);
      ToastNotification({
        message: 'Product updated successfully',
        onClose: () => {}
      });
    } else {
      console.error('Failed to update product' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while updating the product: ', error);
  }
};

const HandleOverwriteDate = async () => {


  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
      },
      body: JSON.stringify({
        id: "676964f5855d970eb0dd3717",
        date_added: mouStartDate,
        date_expires: mouEndDate,
      }),
    });

    if (response.ok) {
      console.log('Date updated successfully');
      setMouStartDate(mouStartDate);
      setMouEndDate(mouEndDate);
      ToastNotification({
        message: 'Date updated successfully',
        onClose: () => {}
      });
    } else {
      console.error('Failed to update date ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while updating the date:', error);
  }
}



const handleOverwriteStage = async () => {

  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
      },
      body: JSON.stringify({
        id: "676964f5855d970eb0dd3717",
        status: currentStage,
      }),
    });

    if (response.ok) {
      console.log('Stage updated successfully');
      setCurrentStage(currentStage);
      ToastNotification({
        message: 'Stage updated successfully',
        onClose: () => {}
      });
      setProgressBar({
        text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : '',
        color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR : '',
        width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH : '',
      });    
      
    } else {
      console.error('Failed to update stage ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while updating the stage:', error);
  }





}


const HandleAprooveMou = async () => {
  
  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
      },
      body: JSON.stringify({
        id: "676964f5855d970eb0dd3717",
        status: 'customer',
      }),
    });

    if (response.ok) {
      console.log('MOU approved successfully');
      setCurrentStage(currentStage);
      ToastNotification({
        message: 'MOU approved successfully',
        onClose: () => {}
      });
      setProgressBar({
        text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label :'',
        color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : '',
        width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : '',
      });
    } else {
      console.error('Failed to approve MOU ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while approving the MOU:', error);
  }
}

useEffect(() => {
  if (currentStage) {
    setProgressBar({
      text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label :'',
        color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : '',
        width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : '',
    });
  }
}, [currentStage]);


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
            <h2 className="text-2xl font-medium">{getEntityById(prospectEntity)} - {getCompanyNameById(companyId)}  Partnership</h2>
            <p className="text-sm text-muted-foreground">for {getProductNameById(selectedProduct)}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
              Acc Management
            </button>
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
            className="h-6" 
          />
        </div>

        {/* Active Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Active Stage - {getStageByValue(currentStage)}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>MOU start date</Label>
              <p className="text-sm text-blue-500 mt-2">{mouStartDate ? new Date(mouStartDate).toISOString().split('T')[0] : 'N/A'}</p>
            </div>
            <div>
              <Label>MOU end date</Label>
              <p className="text-sm text-blue-500 mt-2">{mouEndDate ? new Date(mouEndDate).toISOString().split('T')[0] : 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>MOU</Label>
            {/* <button className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
              <img src="/pdf_icon.png" alt="PDF" className="w-6 h-6"  />
              VIEW PDF
            </button> */}
          {proofDocument && (
            <a href={proofDocument} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded ">
              <img src="/pdf_icon.png" alt="PDF" className="w-6 h-6" />
              VIEW PDF
            </a>
          )}
          </div>

          <div className="mt-4">
            <Label>Category</Label>
            <p className="text-sm text-green-500">{category ? category : 'N/A'}</p>
            <p className="text-sm text-yellow-500">The submitted MOU is still pending for admin&apos;s approval</p>
          </div>


          {/* forCustomer */}
          {/* <div className="flex gap-2 mt-4">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded" onClick={HandleAprooveMou}>
              APPROVE MOU
            </button>
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
              REJECT MOU
            </button>
          </div> */}
        </div>

        {/* Product Selection */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Overwrite Product of The Partnership</h3>
          <select className="w-full p-2 border rounded mb-4" onChange={handleProductChange}>
          <option value="selectedProduct" selected >
                {getProductNameById(selectedProduct)}
              </option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productName}
            </option>
          ))}
          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={HandleSwapProduct}>
            SWAP PRODUCT
          </button>
        </div>

        {/* Partnership Details */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          {/* <h3 className="text-lg font-medium mb-4">Overwrite Partnership Details</h3>
          <select className="w-full p-2 border rounded mb-6" onChange={handleStageChange}>
          <option value="currentStage" selected >
                {getStageByValue(currentStage)}
              </option>
            {PROSPECT_VALUES.filter(stage => stage.value == 'prospect' || stage.value=='lead').map((stage) => (
              <option key={stage.value} value={stage.value}>
              {stage.label}
              </option>
            ))}

          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-6" onClick={handleOverwriteStage}>
            OVERWRITE STAGE
          </button> */}
         
          <div className="grid grid-cols-2 gap-6">
            {/* <div>
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
            </div> */}
            <div>
              <Label>MOU Start Date</Label>
              <Input
                type="date"
                value={mouStartDate ? new Date(mouStartDate).toISOString().split('T')[0] : 'N/A'}
                className={`w-full mt-2 ${styles.mr4}`}
                onChange={handleMouStartDateChange}
              />
            </div>
            <div>
              <Label>MOU End Date</Label>
              <Input
                type="date"
                value={mouEndDate ? new Date(mouEndDate).toISOString().split('T')[0] : 'N/A'}
                className={`w-full mt-2 ${styles.mr4}`}
                onChange={handleMouEndDateChange}
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6" onClick={HandleOverwriteDate}>
            OVERWRITE DATES
          </button>
        </div>

        {/* Prospect Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Prospect Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Remark by entity members</Label>
              {
                              
                              activities.map((element, index) => (
                                 <p className="text-sm text-muted-foreground mt-2" key={index} >{element}</p>
                              ))}
            </div>
            <div>
              <Label>Proof Document</Label>
              {proofDocument && (
              proofDocument.endsWith('.pdf') ? (
                <embed
                  src={proofDocument}
                  type="application/pdf"
                  width="50%"
                  height="50%"
                  className="mt-2 rounded-lg border"
                />
              ) : (
                <img
                  src={proofDocument}
                  alt="Proof Document"
                  className="mt-2 rounded-lg border"
                  width="50%"
                  height="50%"
                />
              )
            )}
            </div>
          </div>
        </div>

        {/* Lead Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Lead Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>MOU start date</Label>
              <p className="text-sm text-blue-500 mt-2">{mouStartDate ? new Date(mouStartDate).toISOString().split('T')[0] : 'N/A'}</p>
            </div>
            <div>
              <Label>MOU end date</Label>
              <p className="text-sm text-blue-500 mt-2">{mouEndDate ? new Date(mouEndDate).toISOString().split('T')[0] : 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>MOU</Label>
            {proofDocument && (
            <a href={proofDocument} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
              <img src="/pdf_icon.png" alt="PDF" className="w-6 h-6" />
              VIEW PDF
            </a>
          )}
          </div>

          <div className="mt-4">
            <Label>Category</Label>
            <p className="text-sm text-green-500">{category}</p>
            <p className="text-sm text-yellow-500">The submitted MOU is still pending for admin&apos;s approval</p>
          </div>

        </div>
      </main>

     
    </div>
  )
}

