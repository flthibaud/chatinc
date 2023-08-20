import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { User } from "../../types";

// Type for our state
export interface AuthState {
  authState: boolean;
  userInfo: User | undefined;
  contactsPage: boolean;
  currentChatUser: User | null;
}

// Initial state
const initialState: AuthState = {
  authState: false,
  userInfo: undefined,
  contactsPage: false,
  currentChatUser: null,
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setAllContactsPage(state) {
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    },
    setCurrentChatUser(state, action) {
      state.currentChatUser = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const {
  setAuthState,
  setUserInfo,
  setAllContactsPage,
  setCurrentChatUser,
} = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;

export default authSlice.reducer;
