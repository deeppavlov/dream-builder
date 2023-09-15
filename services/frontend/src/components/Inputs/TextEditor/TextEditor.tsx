import classNames from 'classnames/bind'
import { EditorState, Modifier, convertFromRaw, convertToRaw } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import React, { useImperativeHandle, useRef } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import s from './TextEditor.module.scss'

interface ITextEditorHandle {
  insertText: (text: string) => Promise<void>
  focus: () => void
}

interface IProps {
  content?: string
  compositeDecorator?: { strategy: Function; component: Function }[]
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  promptContext: { context: string }
}

export const TextEditor = React.forwardRef<ITextEditorHandle, IProps>(
  (
    {
      content,
      compositeDecorator,
      placeholder,
      onChange,
      onBlur,
      promptContext,
    }: IProps,
    forwardRef
  ) => {
    let cx = classNames.bind(s)
    const textEditorRef = useRef<HTMLDivElement>(null)
    const rawData = markdownToDraft(content ?? '')
    const state = convertFromRaw(rawData)
    const [editorState, setEditorState] = React.useState(
      EditorState.moveSelectionToEnd(EditorState.createWithContent(state))
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

    const contextEditor = editorState.getCurrentContent()
    const rawObject = convertToRaw(contextEditor)
    const markdownString = draftToMarkdown(rawObject)
    promptContext.context = markdownString

    return (
      // <Editor
      //   ref={textEditorRef as any}
      //   stripPastedStyles
      //   editorState={editorState}
      //   placeholder={placeholder}
      //   onChange={handleChange}
      //   onBlur={onBlur}
      // />

      <Editor
        editorState={editorState}
        // ref={textEditorRef as any}
        stripPastedStyles
        toolbarClassName={cx('toolbarClassName')}
        wrapperClassName='wrapperClassName'
        editorClassName={cx('editorClassName')}
        placeholder={placeholder}
        toolbar={{
          options: ['list', 'textAlign', 'emoji', 'history'],
        }}
        onBlur={onBlur}
        onEditorStateChange={handleChange}
        // hashtag={{
        //   separator: ' ',
        //   trigger: '#',
        // }}
        // mention={{
        //   separator: ' ',
        //   trigger: '@',
        //   suggestions: [
        //     { text: 'JavaScript', value: 'javascript', url: 'js' },
        //     { text: 'Golang', value: 'golang', url: 'go' },
        //   ],
        // }}
        customDecorators={compositeDecorator}
      />
    )
  }
)
