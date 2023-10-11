// import { autocompletion } from '@codemirror/autocomplete'
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useEffect, useRef } from 'react';
import { inputDecoration, // myAutocomplete,
titleDecoration } from './editorPlugins';


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
    setTimeout(() => {
      const content = document.querySelector(
        '.cm-content'
      ) as HTMLDivElement | null

      const lastChild = content?.lastChild as HTMLElement
      lastChild.scrollIntoView()
    }, 200)
  }, [])

  useEffect(() => {
    if (onChange) {
      onChange(editorContext.code)
    }
  }, [editorContext.code])

  useEffect(() => {
    if ((editorContext.skill === '')) {
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
        setEditorContext({...editorContext, skill: ''})
      }, 200)
  }, [editorContext.skill])

  // const onChangeValue = useCallback((value: string) => {
  //   setEditorContext({ ...editorContext, code: value })
  // }, [])

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
        // autocompletion({ override: [myAutocomplete] }),
      ]}
      onChange={value => setEditorContext({ ...editorContext, code: value })}
    />
  )
}