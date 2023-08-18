import {
  CompositeDecorator,
  Editor,
  EditorState,
  Modifier,
  convertFromRaw,
} from 'draft-js'
import { markdownToDraft } from 'markdown-draft-js'
import React, { useImperativeHandle, useRef } from 'react'

interface ITextEditorHandle {
  insertText: (text: string) => Promise<void>
  focus: () => void
}

interface IProps {
  content?: string
  compositeDecorator?: CompositeDecorator
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const TextEditor = React.forwardRef<ITextEditorHandle, IProps>(
  (
    { content, compositeDecorator, placeholder, onChange, onBlur }: IProps,
    forwardRef
  ) => {
    const textEditorRef = useRef<HTMLDivElement>(null)
    const rawData = markdownToDraft(content ?? '', { preserveNewlines: true })
    const state = convertFromRaw(rawData)
    const [editorState, setEditorState] = React.useState(
      EditorState.moveSelectionToEnd(
        EditorState.createWithContent(state, compositeDecorator)
      )
    )

    const handleChange = (editorState: EditorState) => {
      setEditorState(editorState)

      if (onChange) {
        const plainText = editorState.getCurrentContent().getPlainText()
        onChange(plainText)
      }
    }

    useImperativeHandle(forwardRef, () => ({
      insertText: async text => {
        await new Promise(resolve => {
          insertText(text)
          resolve(true)
        })
      },
      focus: () => textEditorRef?.current?.focus(),
    }))

    const insertText = (text: string) => {
      const currentContent = editorState.getCurrentContent(),
        currentSelection = editorState.getSelection()

      const newContent = Modifier.replaceText(
        currentContent,
        currentSelection,
        text
      )

      const newEditorState = EditorState.push(
        editorState,
        newContent,
        'insert-characters'
      )

      handleChange(
        EditorState.forceSelection(
          newEditorState,
          newContent.getSelectionAfter()
        )
      )
    }

    return (
      <Editor
        ref={textEditorRef as any}
        stripPastedStyles
        editorState={editorState}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={onBlur}
      />
    )
  }
)
