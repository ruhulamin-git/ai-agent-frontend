// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

import AuthUtils from "@/modules/ai-builder/utils/authUtils";

// Authentication removed - always authenticated as a default user
const initialState = {
  user: { name: "User", email: "user@local" },
  isAuthenticated: true,
  isGlobal: true,
  token: null,
  permissions: [],
  features: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      AuthUtils.updateStateAndLocalStorage(state, action.payload);
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = null;
      state.features = null;
      state.isAuthenticated = false;
      state.isGlobal = false;
      AuthUtils.removeCurrentUser();
    },
    workspaceSwitchSuccess: (state, action) => {
      AuthUtils.updateStateAndLocalStorage(state, action.payload);
    },
    upgradePlanSuccess: (state, action) => {
      AuthUtils.updateStateAndLocalStorage(state, action.payload);
    },
    userProfileUpdated: (state, action) => {
      const user = AuthUtils.extractUser(action.payload);
      state.user.name = user.name;
      state.user.email = user.email;
      AuthUtils.updateCurrentUser(state.user);
    },
    workspaceNameUpdated: (state, action) => {
      const updatedWorkspace = action.payload;
      // find the matching assignedWorkspace and update it
      const assignedWorkspaces = state.user.assignedWorkspaces.map((workspace) => {
        if (workspace.id === updatedWorkspace.id) {
          return {
            ...workspace,
            name: updatedWorkspace.name,
          };
        }
        return workspace;
      });
      state.user.assignedWorkspaces = assignedWorkspaces;
      AuthUtils.updateCurrentUser(state.user);
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  workspaceSwitchSuccess,
  upgradePlanSuccess,
  userProfileUpdated,
  workspaceNameUpdated,
} = authSlice.actions;
export default authSlice.reducer;
