//  import { autocompletion } from '@codemirror/autocomplete'
import CodeMirror, {
  EditorView,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror'
import { inputDecoration, titleDecoration } from './editorPlugins'

interface IProps {
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  value: string
  codeEditorRef: ReactCodeMirrorRef | any
}

export const TextEditor = ({
  onChange,
  onBlur,
  placeholder,
  value,
  codeEditorRef,
}: IProps) => {
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
    '&.ͼ4 .cm-line': {
      fontFamily: 'Inter,sans-serif',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: '160%',
      fontSize: '16px',
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
      ref={codeEditorRef}
      onBlur={onBlur}
      value={value}
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
        EditorView.lineWrapping,
      ]}
      onChange={(value: string) => {
        if (onChange) {
          onChange(value)
        }
      }}
    />
  )
}
