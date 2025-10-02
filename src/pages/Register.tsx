import { FC, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpg';

const Register: FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register with:", { name, surname, email, cellphone, password, confirmPassword });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        {/* Logo and App Name */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src={logo} 
            alt="ShopMate Logo" 
            className="w-12 h-12 object-cover rounded-lg mr-3"
          />
          <h1 className="text-2xl font-bold text-gray-800">ShopMate App</h1>
        </div>
        
        {/* Create Account Title */}
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Create Account</h2>
        
        <form onSubmit={handleRegister}>
          {/* First row - Name and Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name:
              </label>
              <Input
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surname:
              </label>
              <Input
                placeholder="Enter Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Second row - Email and Cellphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                Cellphone:
              </label>
              <Input
                type="tel"
                placeholder="Enter Cellphone"
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Third row - Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password:
              </label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Sign Up Button */}
          <Button 
            text="Sign Up" 
            type="submit" 
            className="w-full bg-[#26A91F] text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold"
          />
        </form>
        
        {/* Sign In Link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#26A91F] hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;