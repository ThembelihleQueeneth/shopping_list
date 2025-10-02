import logo from '../assets/logo.jpg'
import { Link } from 'react-router-dom'

export const LandingNavbar = () => {
  return (
    <nav className='flex justify-between items-center bg-gray-50 px-6 py-4 shadow-sm'>
        <div className='flex items-center space-x-3'>
            <img 
              src={logo} 
              alt="ShopMate Logo" 
              className='w-10 h-10 object-cover rounded-lg'
            />
            <h1 className='text-2xl font-bold text-gray-800'>ShopMate App</h1>
        </div>
        <div className='flex items-center space-x-4'>
            <Link to="/login">
              <button className='bg-white text-[#26A91F] px-6 py-2 rounded-lg border border-[#26A91F] hover:bg-gray-50 transition-colors duration-200 font-medium'>
                  Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className='bg-[#26A91F] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium'>
                  Sign Up
              </button>
            </Link>
        </div>
    </nav>
  )
}