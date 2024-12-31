"use client";
import React, { useEffect, useState } from "react";
import { IUserUpdateRequest, createUser, updateUser, deleteUser, fetctAllUserArray, fetchAllEntity } from "@/app/dashboard/user/manage/functions";
import ConfirmationModal from "@/app/components/ConfirmationModal";
type User = {
    _id: string;
    userEmail: string;
    userRole: string;
    entity: Entity;
};

type Entity = {
    _id: string;
    entityName: string;
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);

    const [newUser, setNewUser] = useState({ userEmail: "", userRole: "", userEntityId: "" });
    const [modelText, setModelText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal state
    const [confirmModalAction, setConfirmModalAction] = useState(0);// 0 Null 1 Add 2 Delete 3 Update

    const openModal = (userId: string) => {
        setUserToDelete(userId);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            console.log(`Deleting user with ID: ${userToDelete}`);
            setIsModalOpen(false);
            setUserToDelete(null); // Reset the user to delete
        }
    };

    // Function to handle cancel (e.g., close the modal)
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleAddUser = () => {
        setModelText("Add User");
        setConfirmModalAction(1);
        setIsModalOpen(false);
        if (newUser.userEmail && newUser.userRole && newUser.userEntityId) {
            console.log(newUser);
            createUser(newUser);
            //setUsers([...users, { name: "", ...newUser }]);
            //setNewUser({ userEmail: "", userRole: "", entity:  });
        }
    };

    const ConfirmAddUser = () => {
        setIsModalOpen(false);
        if (newUser.userEmail && newUser.userRole && newUser.userEntityId) {

            createUser(newUser);
        }
    };

    const confirmHandler = () => {
        if (confirmModalAction === 1) {
            handleAddUser();
        } else if (confirmModalAction === 2) {
            handleDeleteConfirm();
        } else if (confirmModalAction === 3) {
        }else{
            handleCancel();
        }
    };

    const handleDeleteUser = (_id: string) => {
        deleteUser(_id);
        //setUsers(users.filter((user) => user.email !== email));
    };

    const handleRoleChange = (id: string, email: string, newRole: string) => {
        const user: IUserUpdateRequest = { _id: id, userEmail: email, userRole: newRole, userEntityId: "" };
        updateUser(user)
        setUsers((users) =>
            users.map((user) =>
                user.userEmail === email ? { ...user, userRole: newRole } : user
            )
        )
    };

    useEffect(() => {
        const fetctAllUsers = async () => {
            const data = await fetctAllUserArray();
            setUsers(data);
        };

        const fetctAllEntity = async () => {
            const data = await fetchAllEntity();
            setEntities(data);
        };
        fetctAllEntity();
        fetctAllUsers();
    }, []);

    return (
        <div className="p-6 mx-auto font-sans">
            {/* Add User Section */}
            <h2 className="text-xl font-bold mb-4">Add new user</h2>
            <div className="flex gap-4 items-center mb-6">
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.userEmail}
                    onChange={(e) => setNewUser({ ...newUser, userEmail: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                />
                <select
                    value={newUser.userRole}
                    onChange={(e) => setNewUser({ ...newUser, userRole: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">User&apos;s Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <select
                    value={newUser.userEntityId}
                    onChange={(e) => setNewUser({ ...newUser, userEntityId: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">User&apos;s Entity</option>
                    {entities.map((entity) => (
                        <option key={entity._id} value={entity._id}>
                            {entity.entityName}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleAddUser}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add User
                </button>
            </div>

            <hr />
            <h2 className="text-xl font-bold mb-4">Current Users</h2>
            <div className="divide-y divide-gray-200">
                {users.map((user) => (
                    <div key={user.userEmail} className="flex items-center justify-between py-3">
                        <div className="flex-1 flex flex-col">
                            {/*<span className="text-sm text-gray-500">Unnamed User</span>*/}
                            <span className="font-medium">{user.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>{user.entity.entityName}</span>
                            <select
                                value={user.userRole}
                                onChange={(e) => handleRoleChange(user._id, user.userEmail, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancel}
                onConfirm={handleDeleteConfirm}
                action={modelText}
            />
        </div>
    );
};

export default UserManagement;

