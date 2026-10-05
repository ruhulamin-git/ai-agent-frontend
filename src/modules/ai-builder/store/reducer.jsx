import { combineReducers } from "redux";

import authReducer from "./reducers/authSlice";
import canvasReducer from "./reducers/canvasReducer";
// reducer import
import customizationReducer from "./reducers/customizationReducer";
import dialogReducer from "./reducers/dialogReducer";
import notifierReducer from "./reducers/notifierReducer";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  canvas: canvasReducer,
  notifier: notifierReducer,
  dialog: dialogReducer,
  auth: authReducer,
});

export default reducer;
