'use client'
import React, { useState } from "react";
import { useEffect } from "react";
import Loader from "./Loader/Loaders";
import Modal from "@/app/Components/Modal";
const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [view, setView] = useState<"posts" | "users">("posts");
    const [error, setError] = useState<string | null>(null);
    const [userCount, setUserCount] = useState<number>(0);
    const [postCount, setPostCount] = useState<number>(0);
    const adminCredentials = {
        username: "a",
        password: "p",
    };

    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: "",
    });

    const [posts, setPosts] = useState([
        { id: 1, title: "Post 1", content: "Content of post 1" },
        { id: 2, title: "Post 2", content: "Content of post 2" },
    ]);

    const [users, setUsers] = useState([
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
    ]);
    const manageUser = () => {
        window.location.href = "/a3q_hak/panel/Admin/manageUser"
    };
    const managePost = () => {
        window.location.href = "/a3q_hak/panel/Admin/managePost"
    };
    const handleLogin = () => {
        if (
            loginDetails.username === adminCredentials.username &&
            loginDetails.password === adminCredentials.password
        ) {
            setIsAuthenticated(true);
        } else {
            setError("Invalid username or password");
            setTimeout(() => {
                setError(null);
            }
            , 4000);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/a3q_hak/api/Admin");
                const data = await response.json();
                setPostCount(data.postCount || 0);
                setUserCount(data.userCount || 0);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const handleDeletePost = (id: number) => {
        setPosts(posts.filter((post) => post.id !== id));
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    const handleEditPost = (id: number) => {
        const newTitle = prompt("Enter new title:");
        const newContent = prompt("Enter new content:");
        if (newTitle && newContent) {
            setPosts(
                posts.map((post) =>
                    post.id === id ? { ...post, title: newTitle, content: newContent } : post
                )
            );
        }
    };

    if (isAuthenticated) {
        return (
            <>

            <div className="grid h-screen place-items-center">
                <Modal />
                <div className="outerbox border border-gray-300 rounded-lg shadow-lg">
                    <div className="innerbox mx-1 my-1 p-4 border border-gray-300 rounded-sm flex flex-col items-center h-[300px]">
                    <h1 className="text-[30px] mx-10 my-5">Admin Login</h1>
                    <div className="flex flex-col items-center">
                    <input
                    className="my-2 bg-gray-900 px-3 py-1 outline-none focus:bg-gray-800"
                    type="text"
                    placeholder="Username"
                    value={loginDetails.username}
                    onChange={(e) =>
                        setLoginDetails({ ...loginDetails, username: e.target.value })
                    }
                />
                <input 
                className="my-2 bg-gray-900 px-3 py-1 outline-none focus:bg-gray-800"
                    type="password"
                    placeholder="Password"
                    value={loginDetails.password}
                    onChange={(e) =>
                        setLoginDetails({ ...loginDetails, password: e.target.value })
                    }
                />
                <button className="px-10 py-1 rounded-2xl bg-blue-600 my-5 outline-none hover:bg-blue-500" onClick={handleLogin}>Login</button>
                <p className="error text-red-500">{error}</p>
                    </div>
                    </div>
                </div>
            </div>
            </>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-[50px] underline my-4">Admin Panel</h1>
                <div className="grid grid-cols-2 gap-4 my-24">
                    <div className="flex flex-col items-center px-10">
                        <h2 className="text-[40px]">1\Post</h2>
                        <div className="text-[80px] self-center"> 
                            {postCount || <Loader/>}
                        </div>
                        <button className="px-1 text-[8px] py-[1px] bg-red-600 active:bg-red-800 hover:bg-red-400" onClick={managePost}>Manage</button>
                    </div>
                    
                    <div className="s border-l-4 border-gray-100 px-10 flex flex-col items-center">
                    <h2 className="text-[40px]">2\User</h2>
                    <div className="text-[80px] self-center"> 
                        {userCount || <Loader/>}
                    </div>
                    <button className="px-1 text-[8px] py-[1px] bg-red-600 active:bg-red-800 hover:bg-red-400" onClick={manageUser}>Manage</button>
                    </div>
                </div>
                
        </div>
    );
};

export default AdminPage;