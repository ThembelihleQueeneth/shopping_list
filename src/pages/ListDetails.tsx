import { useState } from "react";
import { FaArrowLeft, FaPlus, FaTrash, FaCheckCircle, FaEdit } from "react-icons/fa";
import { ItemModal } from "../components/ItemModal";
import { Link } from "react-router-dom";
import { FaSearch } from 'react-icons/fa'
import milk from '../assets/milk.png'

export const ListDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ name: string; quantity: string } | null>(null);

  const handleAddItem = () => {
    setEditingItem(null); 
    setIsModalOpen(true);
  };

  const handleEditItem = (item: { name: string; quantity: string }) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (item: { name: string; quantity: string }) => {
    if (editingItem) {
      console.log("Edited item:", item);
    } else {
      console.log("New item:", item);
    }
  };

  return (
    <>
    <div className='flex-1 max-w-lg mx-8 ml-50'>
        <div className='relative'>
          <input 
            type="text" 
            placeholder='Search items...' 
            className='w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Link to='/home'>
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Monthly Grocery</h1>
        <button
          onClick={handleAddItem}
          className="bg-[#26A91F] text-white px-4 py-2 rounded-lg hover:bg-[#1f8c1a] transition duration-200 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <img src={milk} alt="Milk" className="w-12 h-12 object-cover rounded-lg" />
            <h2 className="text-lg font-semibold text-gray-800">Milk</h2>
            <p className="text-sm text-gray-600">Quantity: 2L</p>

          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEditItem({ name: "Milk", quantity: "2L" })}
              className="text-blue-500 hover:text-blue-600"
              aria-label="Edit Item"
            >
              <FaEdit className="h-5 w-5" />
            </button>
            <button className="text-green-500 hover:text-green-600" aria-label="Confirm Item">
              <FaCheckCircle className="h-5 w-5" />
            </button>
            <button className="text-red-500 hover:text-red-600" aria-label="Delete Item">
              <FaTrash className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        initialData={editingItem || undefined}
      />
    </div>
    </>
  );
};
