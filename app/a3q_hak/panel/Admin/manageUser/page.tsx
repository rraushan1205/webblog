"use client";
import "./ManageUser.css";
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ManageUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/getUsers");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      await fetch(`/api/user/deleteUser/${userId}`, { method: "DELETE" });
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (userId: number) => {
    // You can implement actual edit functionality here
    console.log("Edit user:", userId);
    // For now, just a placeholder
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await fetch(`/api/user/updateRole/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const fuse = new Fuse(users, {
      keys: ["name", "email", "role"],
      threshold: 0.1,
    });

    const results = fuse.search(searchQuery);
    setFilteredUsers(results.map((r) => r.item));
  }, [searchQuery, users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Left Grid - All Users */}

      {/* Right Grid - Search Results */}
      <div className=" mx-10 overflow-y-auto max-h-full custom-scrollbar">
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-b border-gray-300 rounded px-4 py-2 outline-none my-4"
          />
          <div className="flex gap-5 ">
            <button
              className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 mb-4"
              onClick={() => setSearchQuery("")}
            >
              <div className="flex gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.00003 5C7.82888 5 7.66825 5.08261 7.5687 5.22183L3.64604 10.7077C3.25585 11.2534 3.23706 11.9816 3.59858 12.5466L7.58035 18.7703C7.67192 18.9134 7.83012 19 8.00003 19H19.3589C20.2653 19 21 18.2653 21 17.3589V6.64109C21 5.73474 20.2653 5 19.3589 5H8.00003ZM9.64645 8.14645C9.84171 7.95118 10.1583 7.95118 10.3536 8.14645L13.4807 11.2736L16.575 8.14818C16.7693 7.95194 17.0859 7.95036 17.2821 8.14464C17.4784 8.33892 17.4799 8.6555 17.2857 8.85174L14.1878 11.9807L17.3536 15.1464C17.5488 15.3417 17.5488 15.6583 17.3536 15.8536C17.1583 16.0488 16.8417 16.0488 16.6464 15.8536L13.4843 12.6914L10.3553 15.8518C10.161 16.048 9.84446 16.0496 9.64822 15.8553C9.45199 15.661 9.4504 15.3445 9.64468 15.1482L12.7771 11.9843L9.64645 8.85355C9.45119 8.65829 9.45119 8.34171 9.64645 8.14645Z"
                      fill="#000000"
                    ></path>{" "}
                  </g>
                </svg>
                Clear Search
              </div>
            </button>
            <button
              className="bg-green-500 text-white px-2 py-0 rounded hover:bg-green-600 mb-4 w-fit"
              onClick={() => (window.location.href = "/a3q_hak/panel/Admin")}
            >
              <div className="flex gap-2">
                <svg
                  viewBox="-3.8 -3.8 27.60 27.60"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  transform="rotate(45)"
                  stroke="#000000"
                  strokeWidth="0.0002"
                  className="w-6 h-6"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#CCCCCC"
                    strokeWidth="0.68"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <rect x="0" fill="none" width="20" height="20"></rect>{" "}
                    <g>
                      {" "}
                      <path d="M16.95 2.58c1.96 1.95 1.96 5.12 0 7.07-1.51 1.51-3.75 1.84-5.59 1.01l-1.87 3.31-2.99.31L5 18H2l-1-2 7.95-7.69c-.92-1.87-.62-4.18.93-5.73 1.95-1.96 5.12-1.96 7.07 0zm-2.51 3.79c.74 0 1.33-.6 1.33-1.34 0-.73-.59-1.33-1.33-1.33-.73 0-1.33.6-1.33 1.33 0 .74.6 1.34 1.33 1.34z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>{" "}
                <div>Admin Panel</div>
              </div>
            </button>
          </div>
          <h1 className="text-[40px] my-6">Search Results</h1>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td>
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
