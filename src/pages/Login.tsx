import { FC, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpg'

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with:", email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img 
            src={logo} 
            alt="ShopMate Logo" 
            className="w-12 h-12 object-cover rounded-lg mr-3"
          />
          <h1 className="text-3xl font-bold text-[#26A91F]">ShopMate App</h1>
        </div>
        
        
        <h2 className="text-2xl font-bold mb-8 text-center text-[#26A91F]">Sign In</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email:
            </label>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password:
            </label>
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            text="Sign In" 
            type="submit" 
          />
        </form>
        
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an Account yet???{" "}
          <Link to="/register" className="text-[#26A91F] hover:underline font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;