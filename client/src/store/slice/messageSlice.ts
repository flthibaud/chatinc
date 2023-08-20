import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface MessageState {
  messages: any[];
}

// Initial state
const initialState: MessageState = {
  messages: [],
};

// Actual Slice
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    }
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.message,
      };
    },
  },
});

export const {
  setMessages,
  addMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
