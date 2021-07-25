import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query/react'

import { pagesReducer } from "./editor/pagesSlice";
import { resourceApi } from './editor/resourcesSlice'

const store = configureStore({
  reducer: {
    [resourceApi.reducerPath]: resourceApi.reducer,
    pages: pagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resourceApi.middleware),
});

setupListeners(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
