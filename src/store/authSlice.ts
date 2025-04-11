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
      console.log("setAuthUser() " + state.uid + " " + state.username);
    },
    logOutAuth: (state) => {
      console.log("logOutAuth() start " + state.uid + " " + state.username);
      state.uid = undefined;
      state.username = undefined;
      storage.removeItem("persist:auth");
      console.log("logOutAuth() end " + state.uid + " " + state.username);
    },
  },
});

export const { setAuthUser, logOutAuth } = userSlice.actions;
export default userSlice.reducer;
