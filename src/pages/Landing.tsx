import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "../components/LandingNavbar";
import { Footer } from "../components/Footer";

const Landing: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <LandingNavbar />
      <div className="h-screen flex flex-col">
        <div className="flex-1 bg-white flex flex-col items-center justify-center text-center px-6">
          <p className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            The Smartest Way to <span className="text-[#26A91F]">Shop</span>
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-[#26A91F] mb-6">Smarter</p>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
            Stop forgetting items and start saving time and money.
            ShopMate keeps your lists synced, organized, 
            and shareable in real-time.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-[#26A91F] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
        
        <div className="bg-[#26A91F] bg-opacity-50 flex flex-col items-center justify-center text-center px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Ready to simplify your shopping?
          </h2>
          <h3 className="text-lg md:text-xl text-gray-700 mb-4">
            Join thousands of smart shoppers today.
          </h3>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-[#26A91F] px-8 py-3 rounded-lg text-lg font-semibold border border-[#26A91F] hover:bg-gray-50 transition-colors duration-200"
          >
            Create Free Account
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Landing;