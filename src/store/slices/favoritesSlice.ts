import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Provider } from "../../types";

interface FavoritesState {
  items: Provider[];
  ids: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  ids: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/favorites");
      return data.data as Provider[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "טעינת המועדפים נכשלה");
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/add",
  async (providerId: string, { rejectWithValue }) => {
    try {
      await api.post("/favorites/" + providerId);
      return providerId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "ההוספה נכשלה");
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/remove",
  async (providerId: string, { rejectWithValue }) => {
    try {
      await api.delete("/favorites/" + providerId);
      return providerId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "ההסרה נכשלה");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.ids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.ids = action.payload.map((provider) => provider._id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.ids.includes(action.payload)) state.ids.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.ids = state.ids.filter((id) => id !== action.payload);
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;