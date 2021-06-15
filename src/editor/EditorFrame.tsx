import React from "react";
import {useCurrentPage} from "./editorPages";

import './EditorFrame.css'
import {getEditorType} from "./editors";

export default function ({}) {
  const [ curPage ] = useCurrentPage()
  const { Editor } = getEditorType(curPage)

  return (
    <div className='EditorFrame'>
      <Editor/>
    </div>
  )
}
