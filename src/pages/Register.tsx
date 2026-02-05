import { type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { registerUser } from "../features/register_slice/RegisterSlice";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  cellphone?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error: apiError } = useSelector((state: RootState) => state.register);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    cellphone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return "";

      case "surname":
        if (!value.trim()) return "Surname is required";
        if (value.length < 2) return "Surname must be at least 2 characters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";

      case "cellphone":
        if (!value.trim()) return "Cellphone is required";
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) return "Please enter a valid phone number";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const newTouched: Record<string, boolean> = {};

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      newErrors[key as keyof FormErrors] = validateField(key, formData[key as keyof typeof formData]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.values(newErrors).every(error => !error);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords don't match!",
      }));
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

  const getInputClassName = (fieldName: string): string => {
    const baseClass = "px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";
    if (errors[fieldName as keyof FormErrors] && touched[fieldName]) {
      return `${baseClass} border-red-500`;
    }
    return `${baseClass} border-gray-300`;
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

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm mr-60 font-medium text-gray-700 mb-2">
                Name:
              </label>
              <input
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("name")}
                required
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mr-60">
                Surname:
              </label>
              <input
                name="surname"
                placeholder="Enter Surname"
                value={formData.surname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("surname")}
                required
              />
              {errors.surname && touched.surname && (
                <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mr-60">
                Email:
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("email")}
                required
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mr-60">
                Cellphone:
              </label>
              <input
                type="tel"
                name="cellphone"
                placeholder="Enter Cellphone"
                value={formData.cellphone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("cellphone")}
                required
              />
              {errors.cellphone && touched.cellphone && (
                <p className="mt-1 text-sm text-red-600">{errors.cellphone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mr-60">
                Password:
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("password")}
                required
              />
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("confirmPassword")}
                required
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#26A91F] text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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