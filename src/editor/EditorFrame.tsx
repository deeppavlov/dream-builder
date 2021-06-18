import React from "react";
import { useCurrentPage } from "./pagesSlice";

import "./EditorFrame.css";
import { getEditorType } from "./main-editors";

export default function ({}) {
  const [curPage] = useCurrentPage();
  const { Editor } = getEditorType(curPage);

  return (
    <div className="EditorFrame">
      <Editor />
    </div>
  );
}
