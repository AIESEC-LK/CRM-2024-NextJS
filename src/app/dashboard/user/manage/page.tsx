"use client";
import React, { useState } from "react";

type User = {
    name: string;
    email: string;
    role: string;
    entity: string;
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { name: "Aasim Naleem", email: "naleemaasim1@gmail.com", role: "member", entity: "Jayewardenepura" },
        { name: "Adheeb Ahamed", email: "adheebahamed2002@gmail.com", role: "member", entity: "NIBM" },
        { name: "Akshana Cooray", email: "akshanacooray2002@gmail.com", role: "member", entity: "Jayewardenepura" },
        { name: "Akshvinth Adrian John", email: "akshvinthjohn@gmail.com", role: "member", entity: "NIBM" },
    ]);

    const [newUser, setNewUser] = useState({ email: "", role: "", entity: "" });

    const handleAddUser = () => {
        if (newUser.email && newUser.role && newUser.entity) {
            setUsers([...users, { name: "", ...newUser }]);
            setNewUser({ email: "", role: "", entity: "" });
        }
    };

    const handleDeleteUser = (email: string) => {
        setUsers(users.filter((user) => user.email !== email));
    };

    const handleRoleChange = (email: string, newRole: string) => {
        setUsers(users.map((user) => (user.email === email ? { ...user, role: newRole } : user)));
    };

    return (
        <div className="p-6 mx-auto font-sans">
            {/* Add User Section */}
            <h2 className="text-xl font-bold mb-4">Add new user</h2>
            <div className="flex gap-4 items-center mb-6">
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">User's Role</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={newUser.entity}
                    onChange={(e) => setNewUser({ ...newUser, entity: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">User's Entity</option>
                    <option value="Jayewardenepura">Jayewardenepura</option>
                    <option value="NIBM">NIBM</option>
                </select>
                <button
                    onClick={handleAddUser}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add User
                </button>
            </div>

            <hr/>

            {/* Current Users Section */}
            <h2 className="text-xl font-bold mb-4">Current Users</h2>
            <div className="divide-y divide-gray-200">
                {users.map((user) => (
                    <div key={user.email} className="flex items-center justify-between py-3">
                        <div className="flex-1 flex flex-col">
                            <span className="font-medium">{user.name || "Unnamed User"}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>{user.entity}</span>
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button
                                onClick={() => handleDeleteUser(user.email)}
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

