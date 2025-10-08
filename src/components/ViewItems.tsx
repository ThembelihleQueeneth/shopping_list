// components/ViewItems.tsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { type RootState, type AppDispatch } from "../store/store";
import { 
  fetchListItems, 
  addGroceryItem, 
  updateGroceryItem, 
  deleteGroceryItem,
  type GroceryItem
} from "../features/list_slice/listSlice";
import { IoArrowBack, IoAdd, IoClose, IoCheckmark, IoImageOutline } from "react-icons/io5";

// Category options
const CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Frozen Foods",
  "Beverages",
  "Snacks",
  "Pantry",
  "Household",
  "Personal Care",
  "Other"
];

export const ViewItems = () => {
  const { listId } = useParams<{ listId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { lists = [], loading = false, error = null } = useSelector((state: RootState) => (state as any).lists ?? { lists: [], loading: false, error: null });

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemNotes, setNewItemNotes] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Other");
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const [newItemImagePreview, setNewItemImagePreview] = useState<string>("");
  
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemQuantity, setEditItemQuantity] = useState(1);
  const [editItemNotes, setEditItemNotes] = useState("");
  const [editItemCategory, setEditItemCategory] = useState("Other");
  const [editItemImage, setEditItemImage] = useState<File | null>(null);
  const [editItemImagePreview, setEditItemImagePreview] = useState<string>("");

  // Find the current list
  const currentList = lists.find((list: any) => list.id === listId);

  useEffect(() => {
    if (listId) {
      dispatch(fetchListItems(listId));
    }
  }, [dispatch, listId]);

  const handleAddItem = () => {
    if (!newItemName.trim() || !listId) return;

    const newItem: Omit<GroceryItem, 'id'> = {
      name: newItemName.trim(),
      quantity: newItemQuantity,
      category: newItemCategory,
      completed: false,
      listId: listId,
      notes: newItemNotes.trim(),
      image: newItemImagePreview // In a real app, you'd upload this to a server
    };

    dispatch(addGroceryItem(newItem))
      .unwrap()
      .then(() => {
        setNewItemName("");
        setNewItemQuantity(1);
        setNewItemNotes("");
        setNewItemCategory("Other");
        setNewItemImage(null);
        setNewItemImagePreview("");
        setIsAddItemModalOpen(false);
      })
      .catch((err) => console.error("Failed to add item:", err));
  };

  const handleToggleComplete = (item: GroceryItem) => {
    dispatch(updateGroceryItem({
      ...item,
      completed: !item.completed
    }))
      .unwrap()
      .catch((err) => console.error("Failed to update item:", err));
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch(deleteGroceryItem(itemId))
      .unwrap()
      .catch((err) => console.error("Failed to delete item:", err));
  };

  const handleStartEdit = (item: GroceryItem) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemQuantity(item.quantity);
    setEditItemNotes(item.notes || "");
    setEditItemCategory(item.category || "Other");
    setEditItemImagePreview(item.image || "");
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editItemName.trim()) return;

    dispatch(updateGroceryItem({
      ...editingItem,
      name: editItemName.trim(),
      quantity: editItemQuantity,
      notes: editItemNotes.trim(),
      category: editItemCategory,
      image: editItemImagePreview
    }))
      .unwrap()
      .then(() => {
        setEditingItem(null);
        setEditItemName("");
        setEditItemQuantity(1);
        setEditItemNotes("");
        setEditItemCategory("Other");
        setEditItemImage(null);
        setEditItemImagePreview("");
      })
      .catch((err) => console.error("Failed to update item:", err));
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditItemName("");
    setEditItemQuantity(1);
    setEditItemNotes("");
    setEditItemCategory("Other");
    setEditItemImage(null);
    setEditItemImagePreview("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isEdit) {
        setEditItemImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setEditItemImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setNewItemImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setNewItemImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditItemImage(null);
      setEditItemImagePreview("");
    } else {
      setNewItemImage(null);
      setNewItemImagePreview("");
    }
  };

  // Group items by category for better organization
  const groupedItems = currentList?.groceryItems?.reduce((acc: any, item: GroceryItem) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = { pending: [], completed: [] };
    }
    if (item.completed) {
      acc[category].completed.push(item);
    } else {
      acc[category].pending.push(item);
    }
    return acc;
  }, {}) || {};

  if (!currentList) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">List Not Found</h1>
          <Link to="/home" className="text-green-600 hover:text-green-700 font-medium">
            Back to Shopping Lists
          </Link>
        </div>
      </div>
    );
  }

  const completedItems = currentList.groceryItems?.filter((item: GroceryItem) => item.completed) || [];
  const pendingItems = currentList.groceryItems?.filter((item: GroceryItem) => !item.completed) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <IoArrowBack className="h-5 w-5" />
              <span>Back to Lists</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{currentList.name}</h1>
              <p className="text-gray-600 mt-1">
                {currentList.groceryItems?.length || 0} items total
                {completedItems.length > 0 && ` • ${completedItems.length} completed`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="bg-[#26A91F] text-white px-6 py-3 rounded-lg hover:bg-[#1f8c1a] transition duration-200 font-medium flex items-center gap-2"
            disabled={loading}
          >
            <IoAdd className="h-5 w-5" />
            Add Item
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {/* Progress Bar */}
        {currentList.groceryItems && currentList.groceryItems.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {completedItems.length} of {currentList.groceryItems.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(completedItems.length / currentList.groceryItems.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Items List - Grouped by Category */}
        <div className="space-y-8">
          {Object.keys(groupedItems).map((category) => (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Category Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {groupedItems[category].pending.length} pending • {groupedItems[category].completed.length} completed
                </p>
              </div>

              <div className="p-6">
                {/* Pending Items in this Category */}
                {groupedItems[category].pending.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Pending</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {groupedItems[category].pending.map((item: GroceryItem) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                        >
                          {editingItem?.id === item.id ? (
                            <EditItemForm
                              item={item}
                              editItemName={editItemName}
                              setEditItemName={setEditItemName}
                              editItemQuantity={editItemQuantity}
                              setEditItemQuantity={setEditItemQuantity}
                              editItemNotes={editItemNotes}
                              setEditItemNotes={setEditItemNotes}
                              editItemCategory={editItemCategory}
                              setEditItemCategory={setEditItemCategory}
                              editItemImagePreview={editItemImagePreview}
                              handleImageUpload={(e) => handleImageUpload(e, true)}
                              removeImage={() => removeImage(true)}
                              handleSaveEdit={handleSaveEdit}
                              handleCancelEdit={handleCancelEdit}
                            />
                          ) : (
                            <ItemCard
                              item={item}
                              onToggleComplete={handleToggleComplete}
                              onEdit={handleStartEdit}
                              onDelete={handleDeleteItem}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Items in this Category */}
                {groupedItems[category].completed.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Completed</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {groupedItems[category].completed.map((item: GroceryItem) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4 opacity-75"
                        >
                          <ItemCard
                            item={item}
                            onToggleComplete={handleToggleComplete}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteItem}
                            isCompleted={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {(!currentList.groceryItems || currentList.groceryItems.length === 0) && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-gray-400 mb-4">
                <IoAdd className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No items yet</h3>
              <p className="text-gray-500 mb-6">Add your first item to get started!</p>
              <button
                onClick={() => setIsAddItemModalOpen(true)}
                className="bg-[#26A91F] text-white px-6 py-3 rounded-lg hover:bg-[#1f8c1a] transition duration-200 font-medium"
              >
                Add Your First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <AddItemModal
          newItemName={newItemName}
          setNewItemName={setNewItemName}
          newItemQuantity={newItemQuantity}
          setNewItemQuantity={setNewItemQuantity}
          newItemNotes={newItemNotes}
          setNewItemNotes={setNewItemNotes}
          newItemCategory={newItemCategory}
          setNewItemCategory={setNewItemCategory}
          newItemImagePreview={newItemImagePreview}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          handleAddItem={handleAddItem}
          loading={loading}
          onClose={() => setIsAddItemModalOpen(false)}
        />
      )}
    </div>
  );
};

// Item Card Component
const ItemCard = ({ 
  item, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  isCompleted = false 
}: { 
  item: GroceryItem;
  onToggleComplete: (item: GroceryItem) => void;
  onEdit: (item: GroceryItem) => void;
  onDelete: (itemId: string) => void;
  isCompleted?: boolean;
}) => (
  <div className="flex gap-4">
    {/* Image */}
    {item.image && (
      <div className="flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        />
      </div>
    )}
    
    <div className="flex-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleComplete(item)}
            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition duration-200 ${
              isCompleted 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {isCompleted && <IoCheckmark className="h-3 w-3 text-white" />}
          </button>
          <div>
            <h3 className={`font-medium text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
              {item.name}
            </h3>
            <p className="text-sm text-gray-600">
              Quantity: {item.quantity}
            </p>
            {item.notes && (
              <p className="text-sm text-gray-500 mt-1">
                {item.notes}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition duration-200"
            title="Edit item"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id!)}
            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition duration-200"
            title="Delete item"
          >
            <IoClose className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-2 flex items-center gap-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {item.category}
        </span>
      </div>
    </div>
  </div>
);

// Edit Item Form Component
const EditItemForm = ({
  item,
  editItemName,
  setEditItemName,
  editItemQuantity,
  setEditItemQuantity,
  editItemNotes,
  setEditItemNotes,
  editItemCategory,
  setEditItemCategory,
  editItemImagePreview,
  handleImageUpload,
  removeImage,
  handleSaveEdit,
  handleCancelEdit
}: any) => (
  <div className="space-y-4">
    <div className="flex gap-4">
      {/* Image Upload */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          {editItemImagePreview ? (
            <div className="relative">
              <img 
                src={editItemImagePreview} 
                alt="Preview"
                className="w-20 h-20 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <IoClose className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <IoImageOutline className="h-6 w-6 text-gray-400" />
            </label>
          )}
        </div>
      </div>
      
      <div className="flex-1 space-y-3">
        <input
          type="text"
          value={editItemName}
          onChange={(e) => setEditItemName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Item name"
        />
        
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={editItemQuantity}
            onChange={(e) => setEditItemQuantity(parseInt(e.target.value) || 1)}
            className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <select
            value={editItemCategory}
            onChange={(e) => setEditItemCategory(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
    
    <textarea
      value={editItemNotes}
      onChange={(e) => setEditItemNotes(e.target.value)}
      placeholder="Optional notes..."
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
      rows={2}
    />
    
    <div className="flex gap-2">
      <button
        onClick={handleSaveEdit}
        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition duration-200"
      >
        Save
      </button>
      <button
        onClick={handleCancelEdit}
        className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400 transition duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
);

// Add Item Modal Component
const AddItemModal = ({
  newItemName,
  setNewItemName,
  newItemQuantity,
  setNewItemQuantity,
  newItemNotes,
  setNewItemNotes,
  newItemCategory,
  setNewItemCategory,
  newItemImagePreview,
  handleImageUpload,
  removeImage,
  handleAddItem,
  loading,
  onClose
}: any) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        disabled={loading}
      >
        <IoClose size={24} />
      </button>

      <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
      
      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Image (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {newItemImagePreview ? (
              <div className="relative inline-block">
                <img 
                  src={newItemImagePreview} 
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <IoClose className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <IoImageOutline className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Click to upload image</span>
              </label>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter item name..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
        </div>

        {/* Quantity and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optional Notes
          </label>
          <textarea
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
            placeholder="Add any notes here..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleAddItem}
          disabled={!newItemName.trim() || loading}
          className="flex-1 bg-[#26A91F] text-white px-4 py-2 rounded-md hover:bg-[#1f8c1a] disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </div>
    </div>
  </div>
);

export default ViewItems;