import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../types";
import storage from "redux-persist/lib/storage";

const initialState: AuthUser = {
  uid: undefined,
  username: undefined,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.uid = action.payload.uid;
      state.username = action.payload.username;

      if ("fullName" in action.payload) {
        state.fullName = action.payload.fullName;
      }

      if ("bio" in action.payload) {
        state.bio = action.payload.bio;
      }

      if ("pfpUrl" in action.payload) {
        state.pfpUrl = action.payload.pfpUrl;
      }
    },
    logOutAuth: (state) => {
      state.uid = undefined;
      state.username = undefined;
      state.fullName = undefined;
      state.bio = undefined;
      state.pfpUrl = undefined;
      storage.removeItem("persist:auth");
    },
  },
});

export const { setAuthUser, logOutAuth } = userSlice.actions;
export default userSlice.reducer;
