import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.ts";
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import agencySlice from "./agencySlice.ts";


const rootReducer = combineReducers({
    user: userSlice,
    agency: agencySlice,
});

const persistConfig = {
    key: "auth",
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

const myStore = configureStore({
    reducer: {
        auth: persistedReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat()
});

export const persistor = persistStore(myStore);

export default myStore;