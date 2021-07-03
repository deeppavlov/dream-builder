import React from "react";
import { useCurrentPage, useEditorTypeFromPath } from "./pagesSlice";

import "./EditorFrame.css";

export default function ({}) {
  const curPage = useCurrentPage();
  const { Editor } = useEditorTypeFromPath(curPage) || {};
  if (!Editor) throw new Error("Invalid editor type! " + curPage);

  return (
    <div className="EditorFrame">
      <Editor />
    </div>
  );
}
