import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import editors from "./editors";
import { useAppSelector } from "../storeHooks";
import type { RootState } from "../store";

export interface PagesSliceState {
  openPages: {
    [edName: string]: string[];
  };
  currentPage: [string] | [string, string];
}

const initialState: PagesSliceState = {
  openPages: {},
  currentPage: [editors[0].name],
};

Object.values(editors).forEach(
  ({ name }) => (initialState.openPages[name] = [])
);

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    openPage(
      state: PagesSliceState,
      action: PayloadAction<PagesSliceState["currentPage"]>
    ) {
      state.currentPage = action.payload;
    },
  },
});

export const { openPage } = pagesSlice.actions;
export const pagesReducer = pagesSlice.reducer;

export const usePages = () =>
  useAppSelector(({ pages }: RootState) => pages.openPages);
export const useCurrentPage = () =>
  useAppSelector(({ pages }: RootState) => pages.currentPage);
