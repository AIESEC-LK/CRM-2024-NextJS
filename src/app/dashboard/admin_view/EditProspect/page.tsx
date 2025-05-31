'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { useState,useEffect } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import ToastNotification from '@/app/components/ui/toast'
import styles from "./styles.module.css";
import { PROSPECT_BAR_COLOR, PROSPECT_BAR_WIDTH, PROSPECT_VALUES,PROSPECT_EXPIRE_TIME_DURATION ,LEAD_EXPIRE_TIME_DURATION } from '@/app/lib/values';

export default function AdminProspectView() {
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
  const [newProspectFinalDate, setNewProspectFinalDate] = useState(Date);
  const[newProduct, setNewProduct] = useState<string | null>(null);
  const [prospectExpiryDate,setProspectExpiryDate] = useState(Date);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]); 
  const [entities,setEntites] = useState<Entity[]>([]);
  const [prospectEntity,SetprospectEntity] = useState<string | null>(null);

//setProspectId("67697fe544ef4ee398fe8550");

  const [progressBar] = useState({
    text: 'Prospect',
    color: PROSPECT_BAR_COLOR,
    width: PROSPECT_BAR_WIDTH,
  })

  useEffect(() => {
    if (true) {
      const fetchProspectDetails = async () => {
        try {
          const response = await fetch(`/api_new/prospects/get_prospect_in_id?id=67697fe544ef4ee398fe8550`,
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
          setProspectExpiryDate(data.date_expires);
          setSelectedProduct(data.product_type_id);
          SetprospectEntity(data.entity_id)
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchProspectDetails();
    }
  }, [prospectId]); // Add prospectId as a dependency


  
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

const calculateProspectDueDate = (date: string): string => {
  
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
  setNewProspectFinalDate(newDate);
  setProspectExpiryDate(newDate);
  console.log(newDate);
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
        id: "67697fe544ef4ee398fe8550",
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
        id: "67697fe544ef4ee398fe8550",
        date_expires: newProspectFinalDate,
      }),
    });

    if (response.ok) {
      console.log('Date updated successfully');
      setProspectExpiryDate(newProspectFinalDate);
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

      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">MC 01 </h2>
        <p className="text-gray-600">for </p>
        <div className="flex gap-4 mt-4">
          <button className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">
            End Partnership
          </button>
          <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
            Delete Partnership
          </button>
        </div>
      </div> */}


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

      <div className="grid gap-6">
        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg p-4">
          <ProgressBar
            text={progressBar.text}
            color={progressBar.color}
            width={progressBar.width}
          />
        </div>

        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h3 className="text-2xl font-bold mb-6 ml-4">Active Stage - Prospect</h3>
            <ToastNotification
              message={`Due date to go to the lead stage - ${new Date(prospectExpiryDate).toLocaleDateString()}`}
              onClose={() => {}}
            />
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h3 className="text-2xl font-bold mb-6 ml-4">Overwrite Product of The Partnership</h3>
            <select className="w-full ml-4 mt-5 mb-4 form-control" onChange={handleProductChange}>
              <option value="selectedProduct" selected>
                {getProductNameById(selectedProduct)}
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName}
                </option>
              ))}
            </select>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4" onClick={HandleSwapProduct}>
              SWAP PRODUCT
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h3 className="text-2xl font-bold mb-6 ml-4">Overwrite Partnership Details</h3>
            <div className="grid grid-cols-2 gap-4 pl-4 pr-4">
                <div>
                <Label htmlFor="prospect-due">Prospect Due Date</Label>
                <Input
                  id="prospect-due"
                  type="date"
                  value={calculateProspectDueDate(prospectExpiryDate)}
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                  readOnly
                />
                </div>
              <div>
                <Label htmlFor="prospect-final">Prospect Final Due Date</Label>
                <Input
                  id="prospect-final"
                  type="date"
                  value={new Date(prospectExpiryDate).toISOString().split('T')[0]}
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                  onChange={handleDateChange}
                />
              </div>
              {/* <div>
                <Label htmlFor="lead-due">Lead Due Date</Label>
                <Input
                  id="lead-due"
                  type="date"
                  defaultValue="2024-12-27"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                />
              </div>
              <div>
                <Label htmlFor="lead-final">Lead Final Due Date</Label>
                <Input
                  id="lead-final"
                  type="date"
                  defaultValue="2024-12-28"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                />
              </div> */}
            </div>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4 mt-4" onClick={HandleOverwriteDate}>
              OVERWRITE DATES
            </button>
          </div>
        </div>
      </div>
</main>
      {/* <div className="text-center text-gray-600 mt-8">
        <p>© AIESEC Sri Lanka 2019 - 2022</p>
        <p>Powered by TheAITeam</p>
      </div> */}
    </div>
  )
}

