"use client";
import React, { useEffect, useState } from "react";
import { IUserUpdateRequest, createUser, updateUser, deleteUser, fetctAllUserArray, fetchAllEntity } from "@/app/dashboard/user/manage/functions";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useConfirmation } from "@/app/context/ConfirmationContext";

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
    const { triggerConfirmation } = useConfirmation();

    const handleAddUser = async () => {
        if (!newUser.userEmail || !newUser.userRole || !newUser.userEntityId) {
            alert("Please fill in all fields before adding a user.");
            return;
        }
        // Use the centralized confirmation modal
        triggerConfirmation(
            "Are you sure you want to add this user?",
            async () => {
                await createUser(newUser);
                //setUsers([...users, { ...newUser, _id: "temp-id", entity: entities.find((e) => e._id === newUser.userEntityId)! }]);
                setNewUser({ userEmail: "", userRole: "", userEntityId: "" });
            }
        );
    };

    const handleDeleteUser = async (userId: string) => {
        // Use the centralized confirmation modal
        triggerConfirmation("Are you sure you want to delete this user?", async () => {
            await deleteUser(userId);
            setUsers(users.filter((user) => user._id !== userId));
        });
    };

    const handleRoleChange = async (id: string, email: string, newRole: string) => {
        const user: IUserUpdateRequest = { _id: id, userEmail: email, userRole: newRole, userEntityId: "" };

        // Optionally use confirmation for role change as well
        triggerConfirmation(
            `Are you sure you want to change the role of this user to "${newRole}"?`,
            async () => {
                await updateUser(user);
                setUsers((users) =>
                    users.map((user) =>
                        user.userEmail === email ? { ...user, userRole: newRole } : user
                    )
                );
            }
        );
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
        </div>
    );
};

export default UserManagement;

