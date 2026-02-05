import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../store/store";
import {
  fetchUserLists,
  addList,
  updateList,
  deleteList,
  type List,
} from "../features/list_slice/listSlice";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronRight } from "react-icons/fa";

interface CardProps {
  searchTerm: string;
}

export const Card = ({ searchTerm }: CardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const listsState = useSelector((state: RootState) => state.lists);
  const {
    lists = [],
    loading = false,
    error = null,
  } = listsState ?? { lists: [], loading: false, error: null };

  const loginState = useSelector((state: RootState) => state.login);
  const currentUserId = loginState.user?.id ? String(loginState.user.id) : "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // List Form State (Create & Edit)
  const [listName, setListName] = useState("");
  const [editingList, setEditingList] = useState<List | null>(null);

  const [listToDelete, setListToDelete] = useState<List | null>(null);

  useEffect(() => {
    dispatch(fetchUserLists(currentUserId));
  }, [dispatch, currentUserId]);

  const openCreateModal = () => {
    setEditingList(null);
    setListName("");
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, list: List) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingList(list);
    setListName(list.name);
    setIsModalOpen(true);
  };

  const handleSaveList = () => {
    if (!listName.trim()) return;

    if (editingList) {
      dispatch(
        updateList({
          listId: editingList.id,
          name: listName,
        })
      )
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          setEditingList(null);
        })
        .catch((err) => console.error("Failed to update list:", err));
    } else {
      dispatch(
        addList({
          name: listName,
          userId: currentUserId,
        })
      )
        .unwrap()
        .then(() => {
          setListName("");
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Failed to add list:", err));
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, list: List) => {
    e.preventDefault();
    e.stopPropagation();
    setListToDelete(list);
    setIsDeleteModalOpen(true);
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

  const userLists = lists.filter(
    (list: List) =>
      list.userId === currentUserId &&
      list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex mt-10 mb-10 justify-between items-center bg-white rounded-lg shadow-md px-6 py-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800">
          {userLists.length} Shopping List{userLists.length !== 1 ? "s" : ""}
        </h1>

        <button
          onClick={openCreateModal}
          className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg shadow-green-500/30 hover:bg-green-700 hover:scale-105 transition-all duration-200 font-semibold cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Add New List +"}
        </button>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="space-y-4 max-w-4xl mx-auto">
        {userLists.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No shopping lists found. Create your first list!
          </div>
        ) : (
          userLists.map((list: List) => (
            <Link to={`/lists/${list.id}`} key={list.id} className="block group">
              <div className="relative flex justify-between items-center bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:border-green-400 cursor-pointer">

                {/* Content Area */}
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                      {list.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Created: <span className="font-medium">{list.date}</span>
                  </p>

                  <div className="flex items-center gap-4">
                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                      {list.items} item{list.items !== 1 ? "s" : ""}
                    </span>
                    {list.groceryItems?.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{list.groceryItems.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => openEditModal(e, list)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                    title="Rename List"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, list)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Delete List"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                  <div className="pl-2 border-l border-gray-200">
                    <FaChevronRight className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>

              </div>
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
          <div
            className="bg-white rounded-2xl p-8 w-96 shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
              aria-label="Close Modal"
            >
              <IoClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingList ? "Rename List" : "Create New List"}
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">List Name</label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="e.g. Weekly Groceries"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
                onKeyPress={(e) => e.key === "Enter" && handleSaveList()}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveList}
                disabled={!listName.trim() || loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all duration-200 font-semibold"
              >
                {loading ? "Saving..." : editingList ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
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
              aria-label="Cancel"
            </button>

            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Delete List
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the list "
              <span className="font-semibold">{listToDelete?.name}</span>"? This
              action cannot be undone.
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
