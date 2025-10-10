import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";

export const ViewItems = () => {
  const { productId } = useParams<{ productId: string }>();
  const lists = useSelector((state: RootState) => state.lists.lists);

  const list = lists.find((l) => l.productId === productId);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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

  if (!list) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-500">List not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">{list.name} - Items</h1>

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
              key={item.itemId}
              className="p-3 border rounded-md bg-gray-50 flex justify-between"
            >
              <span>{item.name}</span>
              <span className="text-sm text-gray-500">
                {item.category} • Qty: {item.quantity}
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </ul>
    </div>
  );
};
