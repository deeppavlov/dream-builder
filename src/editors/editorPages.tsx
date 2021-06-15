import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import editors from ".";
import { useAppSelector } from "../storeHooks";
import type { RootState } from "../store";

export interface EditorPagesState {
  openPages: {
    [edName: string]: string[];
  };
  currentPage: [string] | [string, string];
}

const initialState: EditorPagesState = {
  openPages: {},
  currentPage: [editors[0].name],
};

Object.values(editors).forEach(
  ({ name }) => (initialState.openPages[name] = [])
);

export const editorPagesSlice = createSlice({
  name: "editorPages",
  initialState,
  reducers: {
    openEditorPage(
      state: EditorPagesState,
      action: PayloadAction<EditorPagesState["currentPage"]>
    ) {
      state.currentPage = action.payload;
    },
  },
});

export const { openEditorPage } = editorPagesSlice.actions;
export const editorPagesReducer = editorPagesSlice.reducer;

export const usePages = () =>
  useAppSelector(({ editorPages }: RootState) => editorPages.openPages);
export const useCurrentPage = () =>
  useAppSelector(({ editorPages }: RootState) => editorPages.currentPage);
