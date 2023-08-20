import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface SocketState {
  socket: any;
}

// Initial state
const initialState: SocketState = {
  socket: null,
};

// Actual Slice
export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
    }
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.socket,
      };
    },
  },
});

export const {
  setSocket,
} = socketSlice.actions;

export default socketSlice.reducer;
