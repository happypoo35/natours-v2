import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import userReducer from "features/user.slice";
import searchReducer from "features/search.slice";
import globalReducer from "features/global.slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    search: searchReducer,
    global: globalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
