import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWithAuth } from "../config/axios";

const API_BASE = "/api/v1/event_front_desks";

// 🟡 Utility for error handling
const handleError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Something went wrong. Please check your connection."
  );
};

// 📥 Fetch all front desks
export const fetchFrontDesks = createAsyncThunk(
  "frontDesk/fetchAll",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.get(`${API_BASE}?event_id=${eventId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// ➕ Create new front desk
export const createFrontDesk = createAsyncThunk(
  "frontDesk/create",
  async ({ name, pin, event_id }, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.post(
        `${API_BASE}?event_id=${event_id}`,
        { event_front_desk: { name, pin } }
      );
      return res.data.front_desk;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// ✏️ Update front desk
export const updateFrontDesk = createAsyncThunk(
  "frontDesk/update",
  async ({ id, event_id, updates }, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.patch(
        `${API_BASE}/${id}?event_id=${event_id}`, // ✅ Correct path
        {
          front_desk_updates: updates,
        }
      );
      return res.data.front_desk;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// ❌ Delete front desk
export const deleteFrontDesk = createAsyncThunk(
  "frontDesk/delete",
  async ({ id, event_id }, { rejectWithValue }) => {
    try {
      await axiosWithAuth.delete(`${API_BASE}/${id}?event_id=${event_id}`); // ✅ Use path param for `id`
      return id;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// 🧩 Slice
const frontDeskSlice = createSlice({
  name: "frontDesk",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔁 FETCH
      .addCase(fetchFrontDesks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrontDesks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFrontDesks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ CREATE
      .addCase(createFrontDesk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // ✏️ UPDATE
      .addCase(updateFrontDesk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // ❌ DELETE
      .addCase(deleteFrontDesk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default frontDeskSlice.reducer;
