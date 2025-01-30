import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userReducerInitialStateTypes } from "../../types/reducerTypes";
import { User } from "../../types/types";

const initialState: userReducerInitialStateTypes = {
  user: null,
  loading: true,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExists: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExists: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const { userExists, userNotExists } = userReducer.actions;
