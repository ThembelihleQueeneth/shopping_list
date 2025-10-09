import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  listId: string;
  notes?: string;
  image?: string; 
}

export interface List {
  id: string;
  name: string;
  items: number;
  date: string;
  userId: string;
  groceryItems: GroceryItem[];
}

const API_URL = "http://localhost:3000"; 
interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

export const fetchUserLists = createAsyncThunk(
  "lists/fetchUserLists",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<List[]>(`${API_URL}/lists?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to fetch lists");
    }
  }
);

export const addList = createAsyncThunk(
  "lists/addList",
  async (payload: { name: string; userId: string }, { rejectWithValue }) => {
    try {
      const newList: Omit<List, "id"> = {
        name: payload.name,
        userId: payload.userId,
        items: 0,
        date: new Date().toLocaleDateString(),
        groceryItems: [],
      };
      const response = await axios.post<List>(`${API_URL}/lists`, newList);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to add list");
    }
  }
);

export const deleteList = createAsyncThunk(
  "lists/deleteList",
  async (listId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/lists/${listId}`);
      return listId;
    } catch (error) {
      return rejectWithValue(error || "Failed to delete list");
    }
  }
);

export const fetchListItems = createAsyncThunk(
  "lists/fetchListItems",
  async (listId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<List>(`${API_URL}/lists/${listId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to fetch list items");
    }
  }
);

export const addGroceryItem = createAsyncThunk(
  "lists/addGroceryItem",
  async (payload: { 
    name: string; 
    quantity: number; 
    listId: string;
    category?: string;
  }, { rejectWithValue }) => {
    try {
      const newItem: Omit<GroceryItem, "id"> = {
        name: payload.name,
        quantity: payload.quantity,
        category: payload.category || "Uncategorized",
        completed: false,
        listId: payload.listId,
      };
      
      const listResponse = await axios.get<List>(`${API_URL}/lists/${payload.listId}`);
      const list = listResponse.data;
      
      const itemWithId: GroceryItem = {
        ...newItem,
        id: Date.now().toString(),
      };
      
      const updatedList = {
        ...list,
        groceryItems: [...(list.groceryItems || []), itemWithId],
        items: (list.groceryItems?.length || 0) + 1,
      };
      
      const response = await axios.put<List>(`${API_URL}/lists/${payload.listId}`, updatedList);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to add grocery item");
    }
  }
);

export const updateGroceryItem = createAsyncThunk(
  "lists/updateGroceryItem",
  async (payload: {
    listId: string;
    itemId: string;
    updates: Partial<GroceryItem>;
  }, { rejectWithValue }) => {
    try {
      const listResponse = await axios.get<List>(`${API_URL}/lists/${payload.listId}`);
      const list = listResponse.data;
      
      const updatedGroceryItems = list.groceryItems.map(item => 
        item.id === payload.itemId 
          ? { ...item, ...payload.updates }
          : item
      );
      
      const updatedList = {
        ...list,
        groceryItems: updatedGroceryItems,
      };
      
      const response = await axios.put<List>(`${API_URL}/lists/${payload.listId}`, updatedList);
      return response.data;
    } catch (error) {
      return rejectWithValue(error|| "Failed to update grocery item");
    }
  }
);

export const deleteGroceryItem = createAsyncThunk(
  "lists/deleteGroceryItem",
  async (payload: {
    listId: string;
    itemId: string;
  }, { rejectWithValue }) => {
    try {
      const listResponse = await axios.get<List>(`${API_URL}/lists/${payload.listId}`);
      const list = listResponse.data;
      
      const updatedGroceryItems = list.groceryItems.filter(item => 
        item.id !== payload.itemId
      );
      
      const updatedList = {
        ...list,
        groceryItems: updatedGroceryItems,
        items: updatedGroceryItems.length,
      };
      
      const response = await axios.put<List>(`${API_URL}/lists/${payload.listId}`, updatedList);
      return response.data;
    } catch (error ){
      return rejectWithValue(error|| "Failed to delete grocery item");
    }
  }
);

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    toggleGroceryItemComplete: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.lists.find(list => list.id === action.payload.listId);
      if (list && list.groceryItems) {
        const item = list.groceryItems.find(item => item.id === action.payload.itemId);
        if (item) {
          item.completed = !item.completed;
        }
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLists.fulfilled, (state, action: PayloadAction<List[]>) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchUserLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(addList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addList.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        state.lists.push(action.payload);
      })
      .addCase(addList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.lists = state.lists.filter(list => list.id !== action.payload);
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchListItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListItems.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        } else {
          state.lists.push(action.payload);
        }
      })
      .addCase(fetchListItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(addGroceryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGroceryItem.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(addGroceryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateGroceryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroceryItem.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(updateGroceryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteGroceryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroceryItem.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(deleteGroceryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  toggleGroceryItemComplete,
  clearError 
} = listSlice.actions;

export default listSlice.reducer;