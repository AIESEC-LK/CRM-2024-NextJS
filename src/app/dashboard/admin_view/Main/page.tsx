'use client'

import { useState,useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import styles from "./styles.module.css"
import { PROSPECT_BAR_COLOR, PROSPECT_BAR_WIDTH, PROSPECT_VALUES,CUSTOMER_PANDING_BAR_COLOR,CUSTOMER_PANDING_BAR_WIDTH,PROSPECT_EXPIRE_TIME_DURATION ,LEAD_EXPIRE_TIME_DURATION,LEAD_BAR_WIDTH,LEAD_BAR_COLOR ,CUSTOMER_BAR_COLOR,CUSTOMER_BAR_WIDTH ,PROMOTER_BAR_COLOR,PROMOTER_BAR_WIDTH ,CUSTOMER_PENDING_MOU_REJECTED_BAR_COLOR,CUSTOMER_PENDING_MOU_REJECTED_BAR_WIDTH,PARTNERHSIPS_UI_PATH} from '@/app/lib/values';
import ToastNotification from '@/app/components/ui/toast';
import { useAuth } from '@/app/context/AuthContext';
import { useConfirmation } from "@/app/context/ConfirmationContext";
export default function ApproveCustomer() {

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [titlePopup, setPopupTitle] = useState('This is the default message.');
    const [messagePopup, setPopupMessage] = useState('This is the default message.');
  
    const openPopup = (newMessage: string, newTitle: string): void => {
      setPopupTitle(newTitle);  // Update the title state dynamically
      setPopupMessage(newMessage);  // Update the message state dynamically
      setIsPopupOpen(true);    // Open the popup
    };

     const { triggerConfirmation } = useConfirmation();
      const closePopup = (): void => setIsPopupOpen(false);


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
const [mouUrl,setMouUrl] = useState<string | null>(null);
const [amount,setAmount] = useState<number | null>(null); 
const [mouStartDate,setMouStartDate] = useState<Date>();
const [mouEndDate,setMouEndDate] = useState<Date>();
const [category,setCategory] = useState<string | null>(null);
const [expiryDate,setExpiryDate] = useState<Date>();
const [dateAdded,setDateAdded] = useState<Date>();
const [nextStage,SetNextStage] = useState<string|null>(null)
const [stageDropwDown,setStageDropDown] = useState<string[]>([]);
const [newStage ,setNewStage] = useState<string | null>(null);
const [canEntityPartner,setCanEntitypartner]  = useState<boolean >(false);
const {user} =useAuth();


    
useEffect(() => {
  const id = searchParams.get('id');
  if (id) {
    setProspectId(id);
  }
}, [searchParams]);


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
        if (!prospectId) {
          console.warn('Prospect ID is null');
          return;
        }
        try {
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=${prospectId}`);
          console.log(prospectId);
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
          const newMouUrl = data.mouUrl;
              setProofDocument(data.lead_proof_url);
           
          setMouUrl(newMouUrl);
          setAmount(data.amount);
          setMouStartDate(data.date_added);
          setMouEndDate(data.date_expires);
          setCategory(data.partnershipType);
          setExpiryDate(data.date_expires);
          setDateAdded(data.date_added);
          console.log(mouUrl)
          console.log(proofDocument);
        


   

   
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchProspectDetails();
    }
  }, [prospectId,mouUrl,proofDocument,amount,mouStartDate,mouEndDate,category,expiryDate,dateAdded]); 


  
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


const getNextStage = (currentStage: string | null) => {
  if (!currentStage) return { value: 'Unknown', label: 'Unknown Stage' };

  const currentIndex = PROSPECT_VALUES.findIndex((prospect) => prospect.value === currentStage);

  if (currentIndex === -1 || currentIndex === PROSPECT_VALUES.length - 1) {
    console.warn(`Next stage for ${currentStage} not found.`);
    return { value: 'Unknown', label: 'Unknown Stage' };
  }

  return PROSPECT_VALUES[currentIndex + 1].label;
};


const getPreviousStages = (currentStage: string | null) => {

if(!currentStage) return { value: 'Unknown', label: 'Unknown Stage'};

const currentIndex = PROSPECT_VALUES.findIndex((prospect) => prospect.value === currentStage);

if(currentIndex === -1 || currentIndex === 0){
  console.warn(`Previous stage for ${currentStage} not found.`);
  return { value: 'Unknown', label: 'Unknown Stage'};
}


const previousStages = PROSPECT_VALUES.slice(0, currentIndex).map(stage => stage);
return previousStages;

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
  const newSelectedStage = event.target.value;
  setNewStage(newSelectedStage);
  console.log(newSelectedStage);
}

const HandleSwapProduct = async () => {
  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: {prospectId},
        product_type_id: newProduct,
      }),
    });

    if (response.ok) {
      console.log('Product updated successfully');
      setSelectedProduct(newProduct);
      loadUpdatedProspect();
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

const HandleOverwriteMoUDate = async () => {


  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: {prospectId},
        date_added: mouStartDate,
        date_expires: mouEndDate,
      }),
    });

    if (response.ok) {
      console.log('Date updated successfully');
      setMouStartDate(mouStartDate);
      setMouEndDate(mouEndDate);
      loadUpdatedProspect();

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

const loadUpdatedProspect = async()=>{

  if (!prospectId) {
    console.warn('Prospect ID is null');
    return;
  }
  try {
    const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=${prospectId}`);
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
    setExpiryDate(data.date_expires);
    setDateAdded(data.date_added);
    
    

  

  } catch (error) {
    console.error(error);

  }





}

const handleOverwriteStage = async () => {

  try {


    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:{prospectId},
        status: newStage,
      }),
    });

    if (response.ok) {
      console.log('Stage updated successfully');
      setCurrentStage(newStage);
      ToastNotification({
        message: 'Stage updated successfully',
        onClose: () => {}
      });
      setProgressBar({
        text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label : currentStage=== 'promoter' ? PROSPECT_VALUES[5].label :  currentStage === 'customerPendingMoURejected' ? PROSPECT_VALUES[8].label : '',
          color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : currentStage === 'promoter' ? PROMOTER_BAR_COLOR : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_COLOR : '',
          width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : currentStage === 'promoter' ? PROMOTER_BAR_WIDTH : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_WIDTH : '',
      });
      loadUpdatedProspect();
      
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
      },
      body: JSON.stringify({
      id: prospectId,
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
        text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label : currentStage=== 'promoter' ? PROSPECT_VALUES[5].label :  currentStage === 'customerPendingMoURejected' ? PROSPECT_VALUES[8].label : '',
          color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : currentStage === 'promoter' ? PROMOTER_BAR_COLOR : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_COLOR : '',
          width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : currentStage === 'promoter' ? PROMOTER_BAR_WIDTH : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_WIDTH : '',
      });
      loadUpdatedProspect();
    } else {
      console.error('Failed to approve MOU ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while approving the MOU:', error);
  }
}



const HandleRejectAprooveMou = async () => {
  
  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      id: prospectId,
      status: 'customerPendingMoURejected',
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
        text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label : currentStage=== 'promoter' ? PROSPECT_VALUES[5].label :  currentStage === 'customerPendingMoURejected' ? PROSPECT_VALUES[8].label : '',
          color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : currentStage === 'promoter' ? PROMOTER_BAR_COLOR : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_COLOR : '',
          width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : currentStage === 'promoter' ? PROMOTER_BAR_WIDTH : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_WIDTH : '',
      });
      loadUpdatedProspect();
    } else {
      console.error('Failed to approve MOU ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while approving the MOU:', error);
  }
}


const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = new Date(event.target.value);
  setExpiryDate(newDate);
  
  console.log(newDate);


}

const calculateStageDueDate = (date: string): string => {

  
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() -1);
  return dueDate.toISOString().split('T')[0];

}


const HandleOverwriteDate = async () => {


  try {
    const response = await fetch('/api_new/prospects/update_a_prospect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: {prospectId},
        date_expires: expiryDate,
      }),
    });

    if (response.ok) {
      console.log('Date updated successfully');
      setExpiryDate(expiryDate);
      ToastNotification({
        message: 'Date updated successfully',
        onClose: () => {}
        
      });
      loadUpdatedProspect();
    } else {
      console.error('Failed to update date ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while updating the date:', error);
  }
}

const DeletePartnership = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  triggerConfirmation(
    "Are you sure you want to delete this partnership ?",
    async () => {
  try {

    const response = await fetch(`/api_new/prospects/delete_a_prospect`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id:prospectId}),

    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete prospect");
    }
    const data = await response.json();
    if (data.success) {
      console.log("Prospect deleted successfully!");
    router.push(PARTNERHSIPS_UI_PATH);

      return { success: true, message: "Prospect deleted successfully!" };
    } else {
      console.warn("No documents were deleted:", data.error);
      return { success: false, message: data.error || "No changes made." };
    }
  } catch (error) {
    console.error("Error deleting prospect:", error);
    return { success: false || "An unknown error occurred." };
  }
}
  )

}


useEffect(() => {
  if (currentStage) {
    setProgressBar({
      text: currentStage === 'prospect' ? PROSPECT_VALUES[1].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customerPending' ? PROSPECT_VALUES[3].label : currentStage === 'lead' ? PROSPECT_VALUES[2].label : currentStage === 'customer' ? PROSPECT_VALUES[4].label : currentStage=== 'promoter' ? PROSPECT_VALUES[5].label :  currentStage === 'customerPendingMoURejected' ? PROSPECT_VALUES[8].label : '',
        color: currentStage === 'prospect' ? PROSPECT_BAR_COLOR : currentStage === 'lead' ? LEAD_BAR_COLOR :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_COLOR :currentStage === 'customer' ? CUSTOMER_BAR_COLOR : currentStage === 'promoter' ? PROMOTER_BAR_COLOR : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_COLOR : '',
        width: currentStage === 'prospect' ? PROSPECT_BAR_WIDTH : currentStage === 'lead' ? LEAD_BAR_WIDTH :currentStage === 'customerPending' ? CUSTOMER_PANDING_BAR_WIDTH :currentStage === 'customer' ? CUSTOMER_BAR_WIDTH : currentStage === 'promoter' ? PROMOTER_BAR_WIDTH : currentStage === 'customerPendingMoURejected' ? CUSTOMER_PENDING_MOU_REJECTED_BAR_WIDTH : '',
    });
  }
}, [currentStage]);

if (user?.role !== "admin") {
  return <div className="container mx-auto p-4">Access Denied</div>;
}else{
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
           
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Common For ALL*/}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium">{getEntityById(prospectEntity)} - {getCompanyNameById(companyId)}  Partnership</h2>
            <p className="text-sm text-muted-foreground">for {getProductNameById(selectedProduct)}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
              Acc Management
            </button>
            {/* <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded">
              End Partnership
            </button> */}
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded" onClick={DeletePartnership}>
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

         {/* EditLead +EditProspect*/}
        {(currentStage === 'prospect' || currentStage === 'lead' ) && (
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Active Stage - {getStageByValue(currentStage)}</h3>
            <ToastNotification
              message={`Due date to go to the ${getNextStage(currentStage)} stage - ${expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}`}
              onClose={() => {}}
            />
          </div>
        )}

        

      {/* Promoter */}
      {(currentStage === 'promoter') && (
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Active Stage - {getStageByValue(currentStage)}</h3>
          <ToastNotification
            message= {`Promoter stage end date - ${expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}`}
           
            onClose={() => {}}
          />
        </div>
      )}

        {/* Show in EditCustomer+ApproveCustomer */}
        {(currentStage === 'customer' || currentStage === 'customerPending'|| currentStage ==='customerPendingMoURejected') && (
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
            
          {mouUrl && (
            <a href={mouUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded ">
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

          

          {/* Show in ApproveCustomer */}
          {(currentStage === 'customerPending' || currentStage ==='customerPendingMoURejected') && (
          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded" onClick={HandleAprooveMou}>
              APPROVE MOU
            </button>
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded" onClick={HandleRejectAprooveMou}>
              REJECT MOU
            </button>
          </div>
          )}
        </div>
        )}

        {/* Show in EditProspect+EditLead+EditCustomer+ApproveMoU+EditPromoter */}
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

        {/* Show in EditLead+EditCustomer+ApproveMoU */}
       

        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">

          
          {(currentStage === 'lead' || currentStage === 'customerPending' || currentStage === 'customer' || currentStage ==='customerPendingMoURejected') && (
            <>
              <h3 className="text-lg font-medium mb-4">Overwrite Partnership Details</h3>
              <select className="w-full p-2 border rounded mb-6" onChange={handleStageChange}>
                <option value="currentStage" selected>
                  {getStageByValue(currentStage)}
                </option>

                



                {PROSPECT_VALUES.filter(stage => stage.value == 'prospect' || stage.value == 'lead').map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-6" onClick={handleOverwriteStage}>
                OVERWRITE STAGE
              </button>
            </>
          )}
         
          <div className="grid grid-cols-2 gap-6">
            

            {/* EditCustomer + Approve Mou */}
            {(currentStage === 'customer' || currentStage === 'customerPending' || currentStage ==='customerPendingMoURejected') && (
            <div>
              <Label>MOU Start Date</Label>
              <Input
                type="date"
                value={mouStartDate ? new Date(mouStartDate).toISOString().split('T')[0] : 'N/A'}
                className={`w-full mt-2 ${styles.mr4}`}
                onChange={handleMouStartDateChange}
              />
            </div>

            )}

            {/* EditCustomer + Approve Mou */}
            {(currentStage === 'customer' || currentStage === 'customerPending' || currentStage ==='customerPendingMoURejected') && (
            <div>
              <Label>MOU End Date</Label>
              <Input
                type="date"
                value={mouEndDate ? new Date(mouEndDate).toISOString().split('T')[0] : 'N/A'}
                className={`w-full mt-2 ${styles.mr4}`}
                onChange={handleMouEndDateChange}
              />
            </div>
            )}

            {/* Show in EditProspect + EditLead  */}
            {(currentStage === 'prospect' || currentStage === 'lead') && (
            <div>
              <Label>{getStageByValue(currentStage)} Due Date</Label>
              <Input
               id="lead-due"
               type="date"
               value={expiryDate ? calculateStageDueDate(new Date(expiryDate).toISOString()) : ''}
               className={`w-full mt-5 ${styles.mr4} mb-4`}
               readOnly
              />
            </div>
            )}

              {/* Show in EditProspect + EditLead  */}
            {(currentStage === 'prospect' || currentStage === 'lead') && (
            <div>
              <Label>{getStageByValue(currentStage)} Final Due Date</Label>
              <Input
                 id="lead-final"
                 type="date"
                 value={expiryDate ? new Date(expiryDate).toISOString().split('T')[0] : ''}
                 className={`w-full mt-5 ${styles.mr4} mb-4`}
                 onChange={handleDateChange}
              />
            </div>
            )}
          </div>
          

            {/* show in EditCustomer + Approve Mou */}
            {(currentStage === 'customer' || currentStage === 'customerPending' || currentStage ==='customerPendingMoURejected') && (
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6" onClick={HandleOverwriteMoUDate}>
            OVERWRITE DATES
          </button>
            )}

          {/* show in EditProspect + EdiLead */}
          {(currentStage === 'prospect' || currentStage === 'lead') && (
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6" onClick={HandleOverwriteDate}>
            OVERWRITE DATES
          </button>
          )}
        </div>


        {/* Show in Lead + Approve Customer + EditCustomer + EditPromoter */}
        {(currentStage === 'promoter' || currentStage === 'lead' || currentStage ==='customerPending' || currentStage==='customer'|| currentStage ==='customerPendingMoURejected') && (
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Prospect Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Remark by entity members</Label>
              {
                activities && activities.map((element, index) => (
                  <p className="text-sm text-muted-foreground mt-2" key={index}>{element}</p>
                ))
              }
            </div>
            <div>
              <Label>Proof Document</Label>
              {/* {proofDocument && (
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
            )} */}
            {proofDocument && proofDocument.includes('sharepoint.com') && (
              <a href={proofDocument} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
                <img src="/pdf_icon.png"  alt="SharePoint" className="w-6 h-6" />
                VIEW DOCUMENT
              </a>
            )}
            </div>
          </div>
        </div>

        )}

        {/* Show in Apporve MoU + EditCustomer + EditPromoter */}
        {(currentStage === 'customer' || currentStage === 'customerPending' || currentStage === 'promoter' || currentStage ==='customerPendingMoURejected') && (
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
            {mouUrl && (
            <a href={mouUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
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
        )}

      
      </main>

     
    </div>
  )
}
}

