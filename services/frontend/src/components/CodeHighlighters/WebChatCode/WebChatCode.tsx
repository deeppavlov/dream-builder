import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import scriptTemplate from 'assets/scripts/embed.js?raw'
import { api } from 'api/axiosConfig'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { ToastCopySucces } from 'components/UI'
import s from './WebChatCode.module.scss'

interface Props {
  assistantId: string
}

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

  return `<script>\n${scriptTemplate.replace(
    '/* params */',
    scriptParams
  )}</script>`
}
export const WebChatCode: FC<Props> = ({ assistantId }) => {
  const [theme] = useState('default')
  const [adaptiveTheme] = useState(false)
  const [isDarkMode] = useState(false)
  const [previewScript, setPreviewScript] = useState(() =>
    getScript(assistantId, theme, adaptiveTheme, isDarkMode)
  )
  const { t } = useTranslation()

  const handleClick = () => {
    navigator.clipboard.writeText(previewScript)
    toast.custom(t => (t.visible ? <ToastCopySucces /> : null), {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  useEffect(() => {
    const script = getScript(assistantId, theme, adaptiveTheme, isDarkMode)
    const hostName = api.defaults.baseURL as string
    const formattedScript = script.replaceAll(
      'https://hostname/',
      hostName.slice(0, -4)
    )
    console.log(api.defaults)
    setPreviewScript(formattedScript)
  }, [assistantId, adaptiveTheme, theme, isDarkMode])

  return (
    <div className={s.container}>
      <div className={s.btnContainer}>
        <Button theme='tertiary2' props={{ onClick: handleClick }}>
          <SvgIcon iconName='copy' />
          {t('assistant_page.integration_tab.wrapper.btns.copy_code')}
        </Button>
      </div>
      <SyntaxHighlighter
        customStyle={{ margin: '0px', borderRadius: '12px' }}
        language='js'
        style={nightOwl}
      >
        {previewScript}
      </SyntaxHighlighter>
    </div>
  )
}
