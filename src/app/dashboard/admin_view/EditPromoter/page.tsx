'use client'

import { useState,useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import styles from "./styles.module.css"
import { PROSPECT_BAR_COLOR, PROSPECT_BAR_WIDTH, PROSPECT_VALUES,CUSTOMER_PANDING_BAR_COLOR,CUSTOMER_PANDING_BAR_WIDTH,PROSPECT_EXPIRE_TIME_DURATION ,LEAD_EXPIRE_TIME_DURATION,LEAD_BAR_WIDTH,LEAD_BAR_COLOR ,CUSTOMER_BAR_COLOR,CUSTOMER_BAR_WIDTH ,PROMOTER_BAR_COLOR,PROMOTER_BAR_WIDTH} from '@/app/lib/values';
import ToastNotification from '@/app/components/ui/toast';

export default function AdminEditPromoter() {
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
const [promoterEndDate,setPromoterEndDate] = useState<Date>();
    
  


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

  useEffect(() => {
    if (true) {
      const fetchProspectDetails = async () => {
        try {
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=676acc88389730e12e76c9ce`);
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
          setPromoterEndDate(data.date_expires);
   

   
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


  useEffect(()=>{

    const fetchAllEntities = async () =>{


      try {
        const response = await fetch('/api_new/entities/get_all_entities');
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
        const response = await fetch('/api_new/companies/get_all_companies');
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

useEffect(() => {
  if (currentStage) {
    setProgressBar({
      text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label : currentStage=== 'promoter' ? PROSPECT_VALUES[5].label :  '',
        color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : currentStage === 'promoter' ? PROMOTER_BAR_COLOR : '',
        width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : currentStage === 'promoter' ? PROMOTER_BAR_WIDTH : '',
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
          {/* <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
              Acc Management
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded">
              End Partnership
            </button>
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
              Delete Partnership
            </button>
          </div> */}
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
          <h3 className="text-lg font-medium mb-4">Active Stage - {getStageByValue(currentStage)}</h3>
          <ToastNotification
            message= {`Promoter stage end date - ${promoterEndDate ? new Date(promoterEndDate).toLocaleDateString() : 'N/A'}`}
           
            onClose={() => {}}
          />
        </div>

        {/* Product Selection */}
        {/* <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Overwrite Product of The Partnership</h3>
          <select className="w-full p-2 border rounded mb-4">
            <option>Select a Product</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            SWAP PRODUCT
          </button>
        </div> */}

        {/* Partnership Details */}
        {/* <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6"> */}
          {/* <h3 className="text-lg font-medium mb-4">Overwrite Partnership Details</h3>
          <select className="w-full p-2 border rounded mb-6">
            <option>Select An Stage</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-6">
            OVERWRITE STAGE
          </button>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Prospect Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-09-01"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Prospect Final Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-09-02"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Lead Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-10-02"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Lead Final Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-10-03"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Promoter End Date</Label>
              <Input
                type="date"
                defaultValue="2024-11-25"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6">
            OVERWRITE DATES
          </button> */}
        {/* </div> */}

        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Prospect Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Remark by entity members</Label>
              {
                              
                              activities?.map((element, index) => (
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
            {/* <div>
              <Label>MOU start date</Label>
              <p className="text-sm text-blue-500 mt-2">{mouStartDate ? new Date(mouStartDate).toISOString().split('T')[0] : 'N/A'}</p>
            </div>
            <div>
              <Label>MOU end date</Label>
              <p className="text-sm text-blue-500 mt-2">{mouEndDate ? new Date(mouEndDate).toISOString().split('T')[0] : 'N/A'}</p>
            </div> */}
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

