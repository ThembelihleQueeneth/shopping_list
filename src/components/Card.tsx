import { FaEllipsisVertical } from "react-icons/fa6";

export const Card = () => {
  return (
    <>
    <div className="flex mt-10 mb-10 justify-between items-center bg-white rounded-lg shadow-md px-6 py-4 max-w-4xl mx-auto">
    <h1 className="text-xl font-semibold text-gray-800">3 Shopping Lists</h1>
    <button className="bg-[#26A91F] text-white px-4 py-2 rounded-lg hover:bg-[#1f8c1a] transition duration-200 font-medium">
        Add New List +
    </button>
</div>
   <div className="space-y-4 max-w-4xl mx-auto">
  {/* Card 1 */}
  <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border border-gray-100">
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Monthly Grocery</h2>
      <p className="text-sm text-gray-600">12 items • Created: Jan 15, 2024</p>
    </div>
    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition duration-200">
      <FaEllipsisVertical className="h-5 w-5" />
    </button>
  </div>

  {/* Card 2 */}
  <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border border-gray-100">
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Weekly Essentials</h2>
      <p className="text-sm text-gray-600">8 items • Created: Jan 12, 2024</p>
    </div>
    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition duration-200">
      <FaEllipsisVertical className="h-5 w-5" />
    </button>
  </div>

  {/* Card 3 */}
  <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border border-gray-100">
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Party Shopping</h2>
      <p className="text-sm text-gray-600">15 items • Created: Jan 10, 2024</p>
    </div>
    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition duration-200">
      <FaEllipsisVertical className="h-5 w-5" />
    </button>
  </div>
</div>
    </>
  )
}
