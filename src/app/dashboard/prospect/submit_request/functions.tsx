export interface FormData {
    companyId: String;
    companyName: String;
    companyAddress: String;
    contactPersonName: String;
    contactPersonNumber: String;
    contactPersonEmail: String;
    productId: String;
    comment: String;
    partnership: String;
    industryId: String;
}

export interface ICompanyQuery {
    _id: any;
    companyName: string;
    dateexpiresEvent:Date;
    dateexpiresProduct:Date;
}

export interface IMyProspectList{
    _id: string;
    date_added: string;
    date_expires: string;
    status: string;
    company_name: string;
    product_type_name: string;
}

export interface Product {
    _id: string;
    productName: string;
    abbravation: string;
}

export interface Industry {
    _id: string;
    industryName: string;
}

const fetchCompanyQuery = async (query: string) => {
    try {
        const response = await fetch(`/api_new/companies/get_by_query?companyName=${query}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching companies:", error);
    }
};


const fetctMyProspectList = async (entity_id: string) => {
    try {
        const response = await fetch(`/api_new/prospects/get_all_my_prospects?entity_id=${entity_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch prospect list');
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching prospect list:", error);
    }
};

const fetchCompany = async (company_id: string) => {
    try {
        const response = await fetch(`/api_new/companies/get_by_id?company_id=${company_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

const fetchProducts = async () => {
    try {
        const response = await fetch("/api_new/products/get_all_products");
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

const fetchIndustry = async () => {
    try {
        const response = await fetch("/api_new/industries/get_all_industries");
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};


const submitProspect = async (data: FormData): Promise<Response | Error> => {
    try {
        
        const response = await fetch("/api_new/prospects/add_a_prospect", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response; // Form submitted successfully
    } catch (error: any) {
        console.error('Error submitting form:', error);
        return error; // Submission failed
    }
};


export { fetctMyProspectList,fetchIndustry, fetchProducts, submitProspect, fetchCompanyQuery,fetchCompany };


