import { useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export const Card = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const handleAddList = () => {
    console.log("New List:", listName);
    setListName("");
    setIsModalOpen(false);
  };

  const toggleMenu = (index: number) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <>
      {/* Header */}
      <div className="flex mt-10 mb-10 justify-between items-center bg-white rounded-lg shadow-md px-6 py-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800">3 Shopping Lists</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#26A91F] text-white px-4 py-2 rounded-lg hover:bg-[#1f8c1a] transition duration-200 font-medium"
        >
          Add New List +
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {[
          { name: "Monthly Grocery", items: 12, date: "Jan 15, 2024" },
          { name: "Weekly Essentials", items: 8, date: "Jan 12, 2024" },
          { name: "Party Shopping", items: 15, date: "Jan 10, 2024" },
        ].map((list, index) => (
          <div
            key={index}
            className="relative flex justify-between items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border border-gray-100"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {list.name}
              </h2>
              <p className="text-sm text-gray-600">
                {list.items} items • Created: {list.date}
              </p>
            </div>

            {/* Ellipsis Button */}
            <button
              onClick={() => toggleMenu(index)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              <FaEllipsisVertical className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {openMenu === index && (
              <div className="absolute right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-md w-40 z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  View Items
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Edit List
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Delete List
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Create New List</h2>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddList}
              className="w-full bg-[#26A91F] text-white px-4 py-2 rounded-md hover:bg-[#1f8c1a] transition duration-200"
            >
              Save List
            </button>
          </div>
        </div>
      )}
    </>
  );
};
