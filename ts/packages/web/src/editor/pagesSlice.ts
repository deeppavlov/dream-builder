import { useMemo } from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import mainEditors, { EditorType } from "./main-editors";
import { useAppSelector } from "../storeHooks";
import type { RootState } from "../store";

export interface Page {
  name: string;
  subpages: Page[];
}

export interface PagesSliceState {
  openPages: Page[];
  currentPage: string[];
}

const editorTypesToPages = (editors: EditorType[]): Page[] =>
  editors.map((ed) => ({
    name: ed.name,
    subpages: ed.subeditors ? editorTypesToPages(ed.subeditors) : [],
  }));

const initialState: PagesSliceState = {
  openPages: editorTypesToPages(mainEditors),
  currentPage: [mainEditors[0].name],
};

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
export const useEditorTypeFromPath = (pagePath: string[]) =>
  useMemo(() => {
    let editors = mainEditors;
    for (let idx = 0; idx < pagePath.length; idx++) {
      const p = pagePath[idx];
      const ed = editors.find(({ name }) => name === p);
      if (!ed) return undefined;
      if (idx === pagePath.length - 1) return ed;
      editors = ed.subeditors || [];
    }
  }, [pagePath.join(".")]);
