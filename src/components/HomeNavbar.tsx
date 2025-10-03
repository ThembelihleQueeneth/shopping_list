import logo from '../assets/logo.jpg'
import { Link } from 'react-router-dom'
import { FaSearch, FaUser, FaEye, FaEdit, FaSignOutAlt, FaTrash, FaMoon, FaSun } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'

export const HomeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // You can add logic here to apply dark mode to your app
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...')
    setIsMenuOpen(false)
  }

  const handleDelete = () => {
    // Add your delete account logic here
    console.log('Deleting account...')
    setIsMenuOpen(false)
  }

  return (
    <nav className='flex justify-between items-center bg-gray-50 px-6 py-4 shadow-sm'>
        {/* Logo Section */}
        <div className='flex items-center space-x-3'>
            <img 
              src={logo} 
              alt="ShopMate Logo" 
              className='w-10 h-10 object-cover rounded-lg'
            />
            <h5 className='text-xl font-bold text-green-700'>ShopMate App</h5>
        </div>

        {/* Search Section */}
        <div className='flex-1 max-w-lg mx-8'>
            <div className='relative'>
                <input 
                  type="text" 
                  placeholder='Search products...' 
                  className='w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white'
                />
                {/* Search Icon */}
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
        </div>

        {/* User Section */}
        <div className='flex items-center space-x-4 relative' ref={menuRef}>
            <h3 className='text-gray-700 font-medium'>Welcome back, User!</h3>
            
            {/* User Icon with Dropdown */}
            <div className='relative'>
                <button 
                  onClick={toggleMenu}
                  className='flex items-center justify-center w-10 h-10 bg-green-100 rounded-full border-2 border-green-200 hover:bg-green-200 transition duration-200 cursor-pointer'
                >
                    <FaUser className="h-5 w-5 text-green-700" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50'>
                    {/* User Info */}
                    <div className='px-4 py-3 border-b border-gray-100'>
                      <p className='text-sm font-medium text-gray-900'>John Doe</p>
                      <p className='text-sm text-gray-500'>john.doe@example.com</p>
                    </div>

                    {/* Menu Items */}
                    <div className='py-1'>
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150'
                      >
                        <FaEye className="h-4 w-4 text-gray-500 mr-3" />
                        View Profile
                      </button>

                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150'
                      >
                        <FaEdit className="h-4 w-4 text-gray-500 mr-3" />
                        Edit Profile
                      </button>

                      {/* Dark Mode Toggle */}
                      <button 
                        onClick={toggleDarkMode}
                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150'
                      >
                        {darkMode ? (
                          <>
                            <FaSun className="h-4 w-4 text-yellow-500 mr-3" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <FaMoon className="h-4 w-4 text-gray-500 mr-3" />
                            Dark Mode
                          </>
                        )}
                      </button>

                      <div className='border-t border-gray-100 my-1'></div>

                      <button 
                        onClick={handleLogout}
                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-150'
                      >
                        <FaSignOutAlt className="h-4 w-4 mr-3" />
                        Logout
                      </button>

                      <button 
                        onClick={handleDelete}
                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-150'
                      >
                        <FaTrash className="h-4 w-4 mr-3" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </div>
    </nav>
  )
}