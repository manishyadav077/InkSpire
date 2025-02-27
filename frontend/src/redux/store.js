import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import themeSlice from "./theme/themeSlice";
import toastSlice from "./toast/toastSlice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  toast: toastSlice,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
