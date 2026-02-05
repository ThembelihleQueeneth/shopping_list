import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "../components/LandingNavbar";

const Landing: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Navbar sits at the top naturally in the flex column */}
      <LandingNavbar />

      {/* Main Content takes up all remaining available space */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          The Smartest Way to <span className="text-[#26A91F]">Shop</span>
        </p>
        <p className="text-2xl md:text-3xl font-semibold text-[#26A91F] mb-6">
          Smarter
        </p>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
          Stop forgetting items and start saving time and money. ShopMate keeps
          your lists synced, organized, and shareable in real-time.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-[#26A91F] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Get Started
        </button>
      </div>

      {/* Footer Section - Compact functionality */}
      <div className="bg-[#26A91F]/10 w-full py-8 flex flex-col items-center justify-center text-center px-6 border-t border-green-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Ready to simplify your shopping?
        </h2>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => navigate("/register")}
            className="bg-[#26A91F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Join Now
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-[#26A91F] font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;