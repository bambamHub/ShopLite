import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance, ApiError } from "@/api/axiosInstance";
import type { LoginResponse, User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  LoginResponse,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
      ...credentials,
      expiresInMins: 60,
    });
    return data;
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Invalid username or password.";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        const { accessToken, ...user } = action.payload;
        state.status = "idle";
        state.user = user;
        state.accessToken = accessToken;
        // Interceptor reads from localStorage directly, so keep it in sync.
        localStorage.setItem("accessToken", accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
