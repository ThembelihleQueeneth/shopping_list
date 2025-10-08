import { type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { registerUser } from "../features/register_slice/RegisterSlice"; 
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";



const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.register);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    cellphone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    dispatch(
      registerUser({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        cellphone: formData.cellphone,
        password: formData.password,
      })
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-center mb-8">
          <img
            src={logo}
            alt="ShopMate Logo"
            className="w-12 h-12 object-cover rounded-lg mr-3"
          />
          <h1 className="text-3xl font-bold text-[#26A91F]">ShopMate App</h1>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-center text-[#26A91F]">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ">
                Name:
              </label>
              <input 
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
               />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surname:
              </label>
              <input 
                name="surname"
                placeholder="Enter Surname"
                value={formData.surname}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email:
              </label>
              <input 
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
               />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cellphone:
              </label>
              
              <input 
                type="tel"
                name="cellphone"
                placeholder="Enter Cellphone"
                value={formData.cellphone}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password:
              </label>
              <input 
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password:
              </label>
              <input 
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#26A91F] text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#26A91F] hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
