import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Message } from "../../types";

// Type for our state
export interface MessageState {
  messages: Message[];
  messageSearch: boolean;
}

// Initial state
const initialState: MessageState = {
  messages: [],
  messageSearch: false,
};

// Actual Slice
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload as Message[];
    },
    addMessage(state, action) {
      return {
        ...state,
        messages: [...state.messages, action.payload] as Message[],
      }
    },
    setMessagesSearch(state, action) {
      state.messageSearch = action.payload as boolean;
    },
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
  setMessagesSearch,
} = messageSlice.actions;

export default messageSlice.reducer;
