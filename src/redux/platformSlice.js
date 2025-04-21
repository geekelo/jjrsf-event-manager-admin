import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWithAuth } from "../config/axios";

const API_BASE = "/api/v1/event_streaming_platforms";

//  Utility for handling API errors
const handleError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Something went wrong. Please check your connection."
  );
};

// Fetch platforms for an event
export const fetchPlatforms = createAsyncThunk(
  "platform/fetchAll",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.get(`${API_BASE}?event_id=${eventId}`);
      return res.data.platforms || res.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

//  Create a new platform
export const createPlatform = createAsyncThunk(
  "platform/create",
  async ({ name, embedUrl, visit_link, event_id }, { rejectWithValue }) => {
    try {
      const embed_code = embedUrl
        ? `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`
        : null;

      const payload = {
        event_id,
        event_streaming_platform: {
          platform_name: name,
          embed_code,
          embed_link: embedUrl,
          visit_link,
        },
      };
      const res = await axiosWithAuth.post(`${API_BASE}`, payload);
      return res.data.platform;
    } catch (error) {
      console.error("API Error:", error?.response?.data || error.message);
      return rejectWithValue(handleError(error));
    }
  }
);

// Update a platform
export const updatePlatform = createAsyncThunk(
  "platform/update",
  async ({ id, event_id, updates }, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.put(
        `${API_BASE}/${id}?event_id=${event_id}`,
        {
          event_streaming_platform: updates,
        }
      );
      return res.data.platform;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Platform slice
const platformSlice = createSlice({
  name: "platform",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch platforms
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create platform
      .addCase(createPlatform.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      //  Update platform
      .addCase(updatePlatform.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default platformSlice.reducer;
