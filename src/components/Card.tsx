import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../store/store";
import { 
  fetchUserLists, 
  addList, 
  deleteList, 
  type List 
} from "../features/list_slice/listSlice";
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

export const Card = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lists = [], loading = false, error = null } = useSelector((state: RootState) => (state as any).lists ?? { lists: [], loading: false, error: null });

  const [currentUserId] = useState("18cc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [listToDelete, setListToDelete] = useState<List | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchUserLists(currentUserId));
  }, [dispatch, currentUserId]);

  const handleAddList = () => {
    if (!listName.trim()) return;
    dispatch(addList({ name: listName, userId: currentUserId }))
      .unwrap()
      .then(() => {
        setListName("");
        setIsModalOpen(false);
      })
      .catch((err) => console.error("Failed to add list:", err));
  };

  const handleDeleteClick = (list: List) => {
    setListToDelete(list);
    setIsDeleteModalOpen(true);
    setOpenMenu(null);
  };

  const handleConfirmDelete = () => {
    if (listToDelete) {
      dispatch(deleteList(listToDelete.id!))
        .unwrap()
        .then(() => {
          setIsDeleteModalOpen(false);
          setListToDelete(null);
        })
        .catch((err) => console.error("Failed to delete list:", err));
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setListToDelete(null);
  };

  const toggleMenu = (listId: string) => {
    setOpenMenu(openMenu === listId ? null : listId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter lists for current user
  const userLists = lists.filter((list:any) => list.userId === currentUserId);

  return (
    <>
      {/* Header */}
      <div className="flex mt-10 mb-10 justify-between items-center bg-white rounded-lg shadow-md px-6 py-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800">
          {userLists.length} Shopping List{userLists.length !== 1 ? 's' : ''}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#26A91F] text-white px-4 py-2 rounded-lg hover:bg-[#1f8c1a] transition duration-200 font-medium"
          disabled={loading}
        >
          {loading ? "Loading..." : "Add New List +"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {userLists.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No shopping lists found. Create your first list!
          </div>
        ) : (
          userLists.map((list: List) => (
            <Link to={`/lists/${list.id}`} key={list.id} className="block">
              <div className="relative flex justify-between items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border border-gray-100">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{list.name}</h2>
                  <p className="text-sm text-gray-600">
                    {list.items} item{list.items !== 1 ? 's' : ''} • Created: {list.date}
                  </p>
                  {list.groceryItems?.length > 0 && (
                    <div className="mt-2">
                      
                        {list.groceryItems.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{list.groceryItems.length - 3} more
                          </span>
                        )}
                      </div>
                   
                  )}
                </div>

                {/* Ellipsis Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent Link navigation
                    toggleMenu(list.id!);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition duration-200"
                  disabled={loading}
                >
                  <FaEllipsisVertical className="h-5 w-5" />
                </button>

                {/* Dropdown Menu */}
                {openMenu === list.id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-md w-40 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      View Items
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Edit List
                    </button>
                    <button
                      onClick={() => handleDeleteClick(list)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete List"}
                    </button>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create List Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div 
            className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              disabled={loading}
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
              onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddList}
                disabled={!listName.trim() || loading}
                className="flex-1 bg-[#26A91F] text-white px-4 py-2 rounded-md hover:bg-[#1f8c1a] disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? "Saving..." : "Save List"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div 
            className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCancelDelete}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              <IoClose size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-red-600">Delete List</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the list "<span className="font-semibold">{listToDelete?.name}</span>"? This action cannot be undone.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? "Deleting..." : "Delete List"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};