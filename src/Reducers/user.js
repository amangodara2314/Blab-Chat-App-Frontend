import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login(state, { payload }) {
      state.user = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    signup(state, { payload }) {
      state.user = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    lsToState(state, { payload }) {
      if (payload.user == undefined) {
        return;
      }
      state.user = payload.user;
    },
    logout(state, { payload }) {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("chat");
      localStorage.removeItem("newMessage");
    },
  },
});

export const { login, signup, lsToState, logout } = UserSlice.actions;
export default UserSlice.reducer;
