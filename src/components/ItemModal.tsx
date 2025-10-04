import { useState, useEffect } from "react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: { name: string; quantity: string }) => void;
  initialData?: { name: string; quantity: string };
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setQuantity(initialData.quantity);
    } else {
      setName("");
      setQuantity("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {initialData ? "Edit Item" : "Add New Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="e.g. 2L, 1 loaf"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#26A91F] text-white hover:bg-[#1f8c1a] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
