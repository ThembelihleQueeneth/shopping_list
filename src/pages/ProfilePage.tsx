import { useState } from 'react'
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa'

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    cellphone: '+1 (555) 123-4567',
    password: '********'
  })

  const [formData, setFormData] = useState({ ...userData })

  const handleEdit = () => {
    setFormData({ ...userData })
    setIsEditing(true)
  }

  const handleSave = () => {
    setUserData({ ...formData })
    setIsEditing(false)
    console.log('Saving user data:', formData)
  }

  const handleCancel = () => {
    setFormData({ ...userData })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
                <FaUser className="h-8 w-8 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {userData.name} {userData.surname}
                </h1>
                <p className='text-gray-500 dark:text-gray-400'>Personal Information</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className='flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200'
              >
                <FaEdit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className='flex space-x-2'>
                <button
                  onClick={handleSave}
                  className='flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200'
                >
                  <FaSave className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className='flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200'
                >
                  <FaTimes className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>
            Profile Details
          </h2>

          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  />
                ) : (
                  <p className='px-3 py-2 text-gray-900 dark:text-white'>{userData.name}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  />
                ) : (
                  <p className='px-3 py-2 text-gray-900 dark:text-white'>{userData.surname}</p>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
              ) : (
                <p className='px-3 py-2 text-gray-900 dark:text-white'>{userData.email}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="cellphone"
                  value={formData.cellphone}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
              ) : (
                <p className='px-3 py-2 text-gray-900 dark:text-white'>{userData.cellphone}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Password
              </label>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
              ) : (
                <div className='flex items-center space-x-2'>
                  <p className='px-3 py-2 text-gray-900 dark:text-white'>{userData.password}</p>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    (Click edit to change password)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}