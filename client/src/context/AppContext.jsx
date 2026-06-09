import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { dummyUserData, dummyChats } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);


    const fetchUser = async () => {
       try {
        const { data } = await axios.get('/api/user/data', {headers: { Authorization: token }})
        if(data.success) {
            setUser(data.user);
        } else {
            toast.error("Failed to fetch user data");
        }
       } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Error fetching user data");
        } finally {
            setLoading(false);
        }
    }

    const createNewChat = async () => {
        try {
            if(!user) {
                toast.error("You must be logged in to create a chat");
                return;
            }
            navigate("/");
            await axios.get('/api/chat/create', {headers: { Authorization: token }})
            await fetchUsersChat();
        } catch (error) {
            console.error("Error creating chat:", error);
            toast.error("Error creating chat");
        }
    }

    const fetchUsersChat = async () => {
        try {
            const { data } = await axios.get('/api/chat/get', {headers: { Authorization: token }})
            if(data.success) {
                setChats(data.chats);
            if(data.chats.length === 0) {
                await createNewChat();
                return;
            }
             else {
                setSelectedChat(data.chats[0]);
        }
        } else{
                toast.error(data.message || "Failed to fetch chats");
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
            toast.error(error.message || "Error fetching chats");
        }
    }   

    useEffect(() => {
    if (token) {
        fetchUser();
    } else {
        setUser(null);
        setLoading(false);
        // Only redirect if not already on a public page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
            navigate("/login");
        }
    }
}, [token]);

    useEffect(() => {
        if (user) {
            fetchUsersChat();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

   useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}, [theme]);

    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        fetchUsersChat,
        createNewChat,
        loading,
        token,
        setToken,
        axios
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () =>  useContext(AppContext);
export default AppContextProvider;