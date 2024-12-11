import { combineReducers, configureStore } from "@reduxjs/toolkit";

import billNodeReducer from "./slices/billNodeSlice";

const rootReducer = combineReducers({
  billNode: billNodeReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
