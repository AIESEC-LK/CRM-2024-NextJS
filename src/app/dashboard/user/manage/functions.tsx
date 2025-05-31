export interface IEntity {
    _id: string;
    entityName: string;
}

interface IUserCreateRequest {
    userEmail: string;
    userRole: string;
    userEntityId: string;
}

export interface IUserUpdateRequest {
    _id: string;
    userEmail: string;
    userRole: string;
    userEntityId: string;
}

const fetctAllUserArray = async () => {
    try {
        const response = await fetch(`/api_new/user/get_all_users`,
            {headers: { 'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET! } }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch All users');
        }
        const userArray = await response.json();
        return userArray;

    } catch (error) {
        console.error("Error fetching All users:", error);
    }
};

const fetchAllEntity = async () => {
    try {
        const response = await fetch("/api_new/entities/get_all_entities",
            {headers: { 'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET! } }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch All Entity');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching All Entity:', error);
        return [];
    }
};

const createUser = async (createUser: IUserCreateRequest): Promise<Response | Error> => {
    try {

        const response = await fetch("/api_new/user/add_a_user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!,
            },
            body: JSON.stringify(createUser),
        });

        if (!response.ok) {
            throw new Error('Failed to Create User');
        }
        return response;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error Failed to Create User:', error.message);
            return error;
        } else {
            console.error('Unexpected error:', error);
            return new Error('Unexpected error occurred');
        }
    }
}

const updateUser = async (updateUser: IUserUpdateRequest): Promise<Response | Error> => {
    try {
        const response = await fetch(`/api_new/user/update_a_user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!,
            },
            body: JSON.stringify(updateUser),
        });

        if (!response.ok) {
            throw new Error('Failed to Update User');
        }
        return response;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error Failed to Update User:', error.message);
            return error;
        } else {
            console.error('Unexpected error:', error);
            return new Error('Unexpected error occurred');
        }
    }
};

const deleteUser = async (userId: string): Promise<Response | Error> => {
    try {
        const response = await fetch(`/api_new/user/delete_a_user?userId=${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-auth': process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET!,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Delete User');
        }
        return response;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error Failed to Delete User:', error.message);
            return error;
        } else {
            console.error('Unexpected error:', error);
            return new Error('Unexpected error occurred');
        }
    }
};


export { fetctAllUserArray, createUser, updateUser, deleteUser, fetchAllEntity /*fetchCompanyQuery/*,fetchCompany*/ };


