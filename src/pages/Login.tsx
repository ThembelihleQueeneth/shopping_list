import { type FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { loginUser } from "../features/login_slice/LoginSlice";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.login
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // 🚀 redirect to home if logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

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

        <h2 className="text-2xl font-bold mb-8 text-center text-[#26A91F]">
          Sign In
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <Button
            text={loading ? "Signing In..." : "Sign In"}
            type="submit"
          />
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an Account yet???{" "}
          <Link
            to="/register"
            className="text-[#26A91F] hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
