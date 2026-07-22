import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Provider, Coords } from "../../types";

interface ProvidersState {
  items: Provider[];
  loading: boolean;
  error: string | null;
  matchedCategory: string | null;
}

const initialState: ProvidersState = {
  items: [],
  loading: false,
  error: null,
  matchedCategory: null,
};

export const fetchProviders = createAsyncThunk(
  "providers/fetchAll",
  async (coords: Coords | undefined, { rejectWithValue }) => {
    try {
      const params = coords ? { lat: coords.lat, lng: coords.lng } : {};
      const { data } = await api.get("/providers", { params });
      return data.data as Provider[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "טעינת הספקים נכשלה"
      );
    }
  }
);

export const searchProviders = createAsyncThunk(
  "providers/search",
  async (payload: { text: string; coords?: Coords }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/search", {
        text: payload.text,
        lat: payload.coords?.lat,
        lng: payload.coords?.lng,
      });
      return {
        items: data.data as Provider[],
        matchedCategory: data.matchedCategory as string,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "החיפוש נכשל");
    }
  }
);

const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.matchedCategory = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.matchedCategory = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.matchedCategory = action.payload.matchedCategory;
      })
      .addCase(searchProviders.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch } = providersSlice.actions;
export default providersSlice.reducer;