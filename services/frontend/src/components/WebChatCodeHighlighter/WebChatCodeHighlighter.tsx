// @ts-ignore
import parserBabel from 'prettier/esm/parser-babel'
// @ts-ignore
import prettier from 'prettier/esm/standalone'
import { FC, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light'
import scriptTemplate from '../../assets/embed.js?raw'
import Button from '../../ui/Button/Button'
import SvgIcon from '../SvgIcon/SvgIcon'
import { ToastCopySucces } from '../Toasts/Toasts'
import s from './WebChatCodeHighlighter.module.scss'

interface Props {
  assistantId: string
}

const format = (code: string) =>
  prettier.format(code, { parser: 'babel', plugins: [parserBabel] })
const themesColors = {
  default: '#3300ff',
  defaultDark: '#3300ff',
  flame: '#d36135',
  flameDark: '#d36135',
  cambridge: '#83bca9',
  cambridgeDark: '#83bca9',
  folly: '#FF3366',
  follyDark: '#FF3366',
}

const getScript = (
  assistantId: string,
  theme: string,
  adaptiveTheme: boolean,
  isDarkMode: boolean
) => {
  const bubbleColor =
    themesColors[
      `${theme}${
        isDarkMode && !adaptiveTheme ? 'Dark' : ''
      }` as keyof typeof themesColors
    ] ?? '#3300ff'
  const bubbleIconSrc =
    'https://www.gstatic.com/images/icons/material/system/2x/chat_bubble_white_24dp.png'
  const scriptParams = `
    const assistant = "${assistantId}";
    const chatTheme = "${theme}";
    const adaptiveTheme = ${adaptiveTheme};
    const bubbleColor = "${bubbleColor}";
    const bubbleIconSrc = "${bubbleIconSrc}";
  `

  return `<script>\n${format(
    scriptTemplate.replace('/* params */', scriptParams)
  )}</script>`
}
export const WebChatCodeHighlighter: FC<Props> = ({ assistantId }) => {
  const [theme] = useState('default')
  const [adaptiveTheme] = useState(false)
  const [isDarkMode] = useState(false)
  const [previewScript, setPreviewScript] = useState(() =>
    getScript(assistantId, theme, adaptiveTheme, isDarkMode)
  )
  const preCodeRef = useRef<HTMLPreElement>(null)

  const handleClick = () => {
    navigator.clipboard.writeText(preCodeRef?.current?.props?.children)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  useEffect(() => {
    const script = getScript(assistantId, theme, adaptiveTheme, isDarkMode)
    setPreviewScript(script)
  }, [assistantId, adaptiveTheme, theme, isDarkMode])

  return (
    <div className={s.container}>
      <div className={s.btnContainer}>
        <Button theme='tertiary2' props={{ onClick: handleClick }}>
          <SvgIcon iconName='copy' />
          Copy Code
        </Button>
      </div>
      <SyntaxHighlighter
        customStyle={{ margin: '0px', borderRadius: '12px' }}
        language='js'
        style={nightOwl}
        ref={preCodeRef}
      >
        {previewScript}
      </SyntaxHighlighter>
    </div>
  )
}
