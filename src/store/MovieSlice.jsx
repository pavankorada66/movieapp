import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_KEY = "915b730e";
const BASE_URL = "https://www.omdbapi.com/";


export const fetchmovie = createAsyncThunk(
  "movies/fetchmovie",
  async ({ page, moviename }, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          s: moviename,
          page,
          apikey: API_KEY,
        },
      });

      if (response.data.Response === "True") {
        return {
          Search: response.data.Search,
        };
      } else {
        
        return rejectWithValue(response.data.Error || "No results found");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movie: [],
    loading: false,
    error: null,
    hasmore: true,
  },
  reducers: {
    reset: (state) => {
      state.movie = [];
      state.loading = false;
      state.error = null;
      state.hasmore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchmovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchmovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = [...state.movie, ...action.payload.Search];
        state.hasmore = action.payload.Search.length >= 10; 
      })
      .addCase(fetchmovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch movies";
        state.hasmore = false;
      });
  },
});

export const { reset } = movieSlice.actions;
export default movieSlice.reducer;
