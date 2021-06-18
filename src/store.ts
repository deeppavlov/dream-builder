import { configureStore } from "@reduxjs/toolkit";
import { pagesReducer } from "./editor/pagesSlice";
import { resourcesReducer } from "./editor/resourcesSlice";

const store = configureStore({
  reducer: {
    pages: pagesReducer,
    resources: resourcesReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
