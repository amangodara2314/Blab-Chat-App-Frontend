import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    selectedGroup: null,
    newGroupMessage: [],
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
    setSelectedGroup(state, { payload }) {
      const { g } = payload;
      state.selectedGroup = g;
      localStorage.setItem("group", JSON.stringify(state.selectedGroup));
    },
    filterNewGroupMessage(state, { payload }) {
      if (state.newGroupMessage.includes(payload.g._id)) {
        let filter = state.newGroupMessage.filter((m) => m != payload.g._id);
        state.newGroupMessage = filter;
      }
    },
    setNewGroupMessage(state, { payload }) {
      if (state.selectedGroup._id == payload.group) {
        return;
      }
      const notify = [...state.newGroupMessage, payload.group];
      state.newGroupMessage = notify;
    },
  },
});

export const {
  login,
  signup,
  lsToState,
  logout,
  setSelectedGroup,
  filterNewGroupMessage,
  setNewGroupMessage,
} = UserSlice.actions;
export default UserSlice.reducer;
