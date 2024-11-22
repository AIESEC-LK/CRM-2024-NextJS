export interface FormData {
    companyName: String;
    companyAddress: String;
    contactPersonName: String;
    contactPersonNumber: String;
    contactPersonEmail: String;
    industry: String;
    producttype: String;
    comment: String;
    partnership: String;
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


const submitProspect = async (data: FormData): Promise<boolean> => {
    try {
        const response = await fetch("/api_new/industries/get_all_industries", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        return true; // Form submitted successfully
    } catch (error) {
        console.error('Error submitting form:', error);
        return false; // Submission failed
    }
};


export { fetchIndustry, fetchProducts, submitProspect };


