// import { autocompletion } from '@codemirror/autocomplete'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { useEffect, useRef } from 'react'
import { inputDecoration, titleDecoration } from './editorPlugins'

interface IProps {
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  editorContext: { code: string; skill: string }
  setEditorContext: Function
}

export const TextEditor = ({
  editorContext,
  setEditorContext,
  onChange,
  onBlur,
  placeholder,
}: IProps) => {
  const ref = useRef<any>(null)

  useEffect(() => {
    if (onChange) {
      onChange(editorContext.code)
    }
  }, [editorContext.code])

  useEffect(() => {
    if (editorContext.skill === '') {
      return
    }
    setTimeout(() => {
      const state = ref.current.view.viewState.state
      const range = state.selection.ranges[0]

      ref.current.view.dispatch({
        changes: {
          from: range.from,
          to: range.to,
          insert: editorContext.skill,
        },
      })

      const newEditorContextCode = ref.current.view.state.doc.text.join('\n')

      setEditorContext({ skill: '', code: newEditorContextCode })
    }, 200)
  }, [editorContext.skill])

  const myTheme = EditorView.theme({
    '.cm-activeLine': {
      backgroundColor: 'transparent',
    },
    '&.ͼ1.cm-focused': {
      outline: 'none',
    },

    '.ͼ5p': {
      height: '100%',
    },
  })

  const baseTheme = EditorView.baseTheme({
    '.widget-input': {
      color: 'blue',
    },
    '.widget-title': {
      textDecoration: 'underline',
    },
  })

  return (
    <CodeMirror
      ref={ref}
      onBlur={onBlur}
      value={editorContext.code}
      theme={myTheme}
      placeholder={placeholder}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightSelectionMatches: false,
      }}
      extensions={[
        inputDecoration,
        titleDecoration,
        baseTheme,
        //
      ]}
      onChange={value => setEditorContext({ ...editorContext, code: value })}
    />
  )
}
