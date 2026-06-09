import {useState} from 'react'
import { useAppContext } from '../context/AppContext'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom' 

function Login() {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {axios, setToken } = useAppContext();
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "login" ? '/api/user/login' : '/api/user/register'
    try {
        const {data} = await axios.post(url, {name,email,password})
        if(data.success){
            setToken(data.token)
            localStorage.setItem('token', data.token)
            navigate('/')
        }
        else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message)
    }
  }
 return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-md">
    <p className="text-2xl font-semibold m-auto text-gray-800 dark:text-white">
      <span className="text-purple-600 dark:text-purple-400">User</span> {state === "login" ? "Login" : "Sign Up"}
    </p>
    {state === "register" && (
      <div className="w-full">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here"
          className="bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg w-full p-2.5 outline-none focus:border-purple-500 dark:text-white text-gray-800 placeholder-gray-400 transition"
          type="text" required />
      </div>
    )}
    <div className="w-full">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Email</p>
      <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here"
        className="bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg w-full p-2.5 outline-none focus:border-purple-500 dark:text-white text-gray-800 placeholder-gray-400 transition"
        type="email" required />
    </div>
    <div className="w-full">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Password</p>
      <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here"
        className="bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg w-full p-2.5 outline-none focus:border-purple-500 dark:text-white text-gray-800 placeholder-gray-400 transition"
        type="password" required />
    </div>
    {state === "register" ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Already have an account? <span onClick={() => setState("login")} className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">click here</span>
      </p>
    ) : (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Create an account? <span onClick={() => setState("register")} className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">click here</span>
      </p>
    )}
    <button type="submit" className="bg-purple-600 hover:bg-purple-700 transition-all text-white w-full py-2.5 rounded-lg cursor-pointer font-medium">
      {state === "register" ? "Create Account" : "Login"}
    </button>
  </form>
)
}

export default Login