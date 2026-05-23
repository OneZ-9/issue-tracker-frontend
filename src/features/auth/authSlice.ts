import {
  clearTokens,
  getToken,
  getUserData,
  setTokens,
  setUserData,
  updateStoredTokens,
} from "@/lib/tokenStorage";
import type { User } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = { token: string } & User;
type SignInPayload = { refreshToken: string; rememberMe: boolean } & AuthState;

const storedUser = getUserData<User>();

const initialState: AuthState = {
  _id: storedUser?._id ?? "",
  name: storedUser?.name ?? "",
  email: storedUser?.email ?? "",
  role: storedUser?.role ?? "user",
  isActive: storedUser?.isActive ?? false,
  createdAt: storedUser?.createdAt ?? "",
  updatedAt: storedUser?.updatedAt ?? "",
  token: getToken(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<SignInPayload>) => {
      const { rememberMe, refreshToken, ...userData } = action.payload;
      state._id = userData._id;
      state.name = userData.name;
      state.email = userData.email;
      state.role = userData.role;
      state.isActive = userData.isActive;
      state.createdAt = userData.createdAt;
      state.updatedAt = userData.updatedAt;
      state.token = userData.token;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token: _token, ...userProfile } = userData;
      setTokens(userData.token, refreshToken, rememberMe);
      setUserData(userProfile as Record<string, unknown>);
    },
    updateTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>,
    ) => {
      state.token = action.payload.token;
      updateStoredTokens(action.payload.token, action.payload.refreshToken);
    },
    signOut: () => {
      clearTokens();
      return initialState;
    },
  },
});

export const { signIn, signOut, updateTokens } = authSlice.actions;

export default authSlice.reducer;
