import { configureStore } from "@reduxjs/toolkit";
import { pagesReducer } from "./editor/pagesSlice";
import { resourcesReducer } from "./editor/resourcesSlice";

const serverMiddleware = (store) => (next) => (action) => {
  fetch("/api/res", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store.getState()),
  });
  next(action);
};

const store = configureStore({
  reducer: {
    pages: pagesReducer,
    resources: resourcesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serverMiddleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
