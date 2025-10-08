import { useState, useEffect } from 'react'
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState, type AppDispatch } from '../store/store'
import { updateUserInDB } from '../features/login_slice/LoginSlice'

export const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.login)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    cellphone: '',
    password: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        cellphone: user.cellphone || '',
        password: user.password || ''
      })
    }
  }, [user])

  const handleEdit = () => setIsEditing(true)

  const handleSave = () => {
    if (user?.id) {
      dispatch(updateUserInDB({ id: user.id, data: formData }))
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        cellphone: user.cellphone || '',
        password: user.password || ''
      })
    }
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                <FaUser className="h-8 w-8 text-green-700" />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {formData.name} {formData.surname}
                </h1>
                <p className='text-gray-500'>Personal Information</p>
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
                  <span>{loading ? 'Saving...' : 'Save'}</span>
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

        {/* Profile Details */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-6'>Profile Details</h2>

          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                ) : (
                  <p className='px-3 py-2'>{formData.name}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                ) : (
                  <p className='px-3 py-2'>{formData.surname}</p>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              ) : (
                <p className='px-3 py-2'>{formData.email}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="cellphone"
                  value={formData.cellphone}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              ) : (
                <p className='px-3 py-2'>{formData.cellphone}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              ) : (
                <div className='flex items-center space-x-2'>
                  <p className='px-3 py-2'>{formData.password}</p>
                  <span className='text-xs text-gray-500'>(Click edit to change password)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
