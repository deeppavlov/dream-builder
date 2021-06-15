import { configureStore } from "@reduxjs/toolkit";
import { editorPagesReducer } from "./editors/editorPages";

const store = configureStore({
  reducer: {
    editorPages: editorPagesReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
