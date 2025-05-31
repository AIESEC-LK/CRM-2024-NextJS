'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useState,useEffect } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import ToastNotification from '@/app/components/ui/toast'
import styles from "./styles.module.css"
import { PROSPECT_BAR_COLOR, PROSPECT_BAR_WIDTH, PROSPECT_VALUES,PROSPECT_EXPIRE_TIME_DURATION ,LEAD_EXPIRE_TIME_DURATION,LEAD_BAR_WIDTH,LEAD_BAR_COLOR } from '@/app/lib/values';


export default function EditLead() {

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
  const [newLeadFinalDate, setnewLeadFinalDate] = useState(Date);
  const[newProduct, setNewProduct] = useState<string | null>(null);
  const [leadExpiryDate,setleadExpiryDate] = useState(Date);
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
    
  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api_new/products/get_all_products', {
          headers: {
            "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!, // internal secret
          },
        });
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
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=67694b10855d970eb0dd3712`,
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
          setleadExpiryDate(data.date_expires);
          setSelectedProduct(data.product_type_id);
          SetprospectEntity(data.entity_id)
          setCurrentStage(data.status);
          setActivities(data.activities);
          setProofDocument(data.lead_proof_url);
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

const calculateLeadDueDate = (date: string): string => {

  
  const prospectDate = new Date(date);
  prospectDate.setDate(prospectDate.getDate() -1);
  return prospectDate.toISOString().split('T')[0];


}

const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const newProductId = event.target.value;
  setNewProduct(newProductId);
  console.log(newProductId);
};
const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = event.target.value;
  setnewLeadFinalDate(newDate);
  setleadExpiryDate(newDate);
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
        id: "67694b10855d970eb0dd3712",
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
        id: "67694b10855d970eb0dd3712",
        date_expires: newLeadFinalDate,
      }),
    });

    if (response.ok) {
      console.log('Date updated successfully');
      setleadExpiryDate(newLeadFinalDate);
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
        id: "67694b10855d970eb0dd3712",
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

const [progressBar, setProgressBar] = useState({
  text: '',
  color: '',
  width: '',
});

useEffect(() => {
  if (currentStage) {
    setProgressBar({
      text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : '',
      color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR : '',
      width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH : '',
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
            <h2 className="text-2xl font-medium">{getEntityById(prospectEntity)} - {getCompanyNameById(companyId)} Partnership</h2>
            <p className="text-sm text-muted-foreground">for {getProductNameById(selectedProduct)}</p>
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
            message={`Due date to go to the customer stage - ${new Date(leadExpiryDate).toLocaleDateString()}`}
            onClose={() => {}}
          />
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
          <h3 className="text-lg font-medium mb-4">Overwrite Partnership Details</h3>
          <select className="w-full p-2 border rounded mb-6" onChange={handleStageChange}>
          <option value="currentStage" selected >
                {getStageByValue(currentStage)}
              </option>
            {PROSPECT_VALUES.filter(stage => stage.value == 'prospect').map((stage) => (
              <option key={stage.value} value={stage.value}>
              {stage.label}
              </option>
            ))}

          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-6" onClick={handleOverwriteStage}>
            OVERWRITE STAGE
          </button>
          
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
            </div> */}
            <div>
              <Label>Lead Due Date</Label>
              <Input
               id="lead-due"
               type="date"
               value={calculateLeadDueDate(leadExpiryDate)}
               className={`w-full mt-5 ${styles.mr4} mb-4`}
               readOnly
              />
            </div>
            <div>
              <Label>Lead Final Due Date</Label>
              <Input
                 id="lead-final"
                 type="date"
                 value={new Date(leadExpiryDate).toISOString().split('T')[0]}
                 className={`w-full mt-5 ${styles.mr4} mb-4`}
                 onChange={handleDateChange}
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6" onClick={HandleOverwriteDate}>
            OVERWRITE DATES
          </button>
        </div>

        {/* Prospect Stage */}

        {currentStage === 'lead' ? (
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
              {/* <img 
                src="/placeholder.svg?height=200&width=400" 
                alt="Proof Document"
                className="mt-2 rounded-lg border"
              /> */}
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
      ) : null}
      </main>

      {/* Footer */}
      {/* <footer className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>© AIESEC Sri Lanka 2019 - 2022</p>
        <p>Powered by TheAITeam</p>
      </footer> */}
    </div>
  )
}

