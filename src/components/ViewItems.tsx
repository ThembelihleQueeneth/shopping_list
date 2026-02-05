import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../store/store";
import {
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
  type GroceryItem
} from "../features/list_slice/listSlice";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";

export const ViewItems = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const listsState = useSelector((state: RootState) => state.lists);
  const lists = listsState.lists;
  const loading = listsState.loading;

  const list = lists.find((l) => l.id === listId);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Add/Edit Item State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCategory, setItemCategory] = useState("Uncategorized");
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  // Delete Item State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GroceryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (!list) return [];
    return list.groceryItems
      .filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [list, search, sortOrder]);

  const openAddModal = () => {
    setEditingItem(null);
    setItemName("");
    setItemQuantity(1);
    setItemCategory("Uncategorized");
    setIsModalOpen(true);
  };

  const openEditModal = (item: GroceryItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemCategory(item.category);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item: GroceryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemName.trim() || !listId) return;

    if (editingItem) {
      dispatch(
        updateGroceryItem({
          listId,
          itemId: editingItem.id,
          updates: {
            name: itemName,
            quantity: itemQuantity,
            category: itemCategory,
          },
        })
      )
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          setEditingItem(null);
        })
        .catch((err) => console.error("Failed to update item:", err));
    } else {
      dispatch(
        addGroceryItem({
          name: itemName,
          quantity: itemQuantity,
          category: itemCategory,
          listId: listId,
        })
      )
        .unwrap()
        .then(() => {
          setItemName("");
          setItemQuantity(1);
          setItemCategory("Uncategorized");
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Failed to add item:", err));
    }
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete || !listId) return;

    dispatch(
      deleteGroceryItem({
        listId,
        itemId: itemToDelete.id,
      })
    )
      .unwrap()
      .then(() => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      })
      .catch((err) => console.error("Failed to delete item:", err));
  };

  if (!list) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-500">List not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-10">
      <div className="flex justify-between items-center bg-white rounded-lg shadow px-6 py-4 mb-6">
        <h1 className="text-2xl font-semibold">{list.name} - Items</h1>
        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="bg-[#26A91F] text-white px-4 py-2 rounded-lg hover:bg-[#1f8c1a] transition duration-200 font-medium cursor-pointer"
            disabled={loading}
          >
            Add Item +
          </button>
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        {/* Search */}
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        >
          <option value="asc">Sort A–Z</option>
          <option value="desc">Sort Z–A</option>
        </select>

        {/* Items List */}
        <ul className="space-y-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="p-3 border rounded-md bg-gray-50 flex justify-between items-center group"
              >
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <div className="text-sm text-gray-500">
                    {item.category} • Qty: {item.quantity}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                    title="Edit Item"
                    disabled={loading}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    title="Delete Item"
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No items found.</p>
          )}
        </ul>
      </div>

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
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

            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Milk"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSaveItem()}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) =>
                    setItemQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Uncategorized">Uncategorized</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Meat">Meat</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={!itemName.trim() || loading}
                className="flex-1 bg-[#26A91F] text-white px-4 py-2 rounded-md hover:bg-[#1f8c1a] disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                {loading
                  ? "Saving..."
                  : editingItem
                    ? "Save Changes"
                    : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-80 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              <IoClose size={24} />
            </button>

            <h2 className="text-lg font-bold mb-4 text-red-600">Delete Item</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "
              <span className="font-semibold">{itemToDelete?.name}</span>"?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
