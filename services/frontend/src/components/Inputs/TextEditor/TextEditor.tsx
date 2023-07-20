import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  convertFromHTML,
} from 'draft-js'
import React from 'react'

interface IProps {
  content?: string | JSX.Element | React.ReactNode | JSX.Element[]
  compositeDecorator?: CompositeDecorator
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const TextEditor = React.forwardRef(
  (
    { content, compositeDecorator, placeholder, onChange, onBlur }: IProps,
    ref: React.LegacyRef<any>
  ) => {
    const blocksFromHTML = convertFromHTML(
      content?.toString()?.replace(/\n/g, '<br />') ?? ''
    )
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )
    const [editorState, setEditorState] = React.useState(
      EditorState.createWithContent(state, compositeDecorator)
    )

    const handleChange = (editorState: EditorState) => {
      setEditorState(editorState)

      if (onChange) {
        const plainText = editorState.getCurrentContent().getPlainText()
        onChange(plainText)
      }
    }

    return (
      <Editor
        ref={ref}
        stripPastedStyles
        editorState={editorState}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={onBlur}
      />
    )
  }
)
