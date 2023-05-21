// @ts-ignore
// @ts-ignore
import { FC, useRef } from 'react'
import toast from 'react-hot-toast'
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light'
import curlTemplate from '../../assets/curl.bash?raw'
import nodeTemplate from '../../assets/node.js?raw'
import pythonTemplate from '../../assets/python.py?raw'
import { API_CALL_TAB } from '../../constants/constants'
import { TApiCallType, useDisplay } from '../../context/DisplayContext'
import { api } from '../../services/axiosConfig'
import Button from '../../ui/Button/Button'
import { consts } from '../../utils/consts'
import SvgIcon from '../SvgIcon/SvgIcon'
import { SwitchButtonAPICall } from '../SwitchButtonAPICall/SwitchButtonAPICall'
import { ToastCopySucces } from '../Toasts/Toasts'
import s from './ApiCallCodeHighlighter.module.scss'

interface Props {
  assistantId: string
}

export const ApiCallCodeHighlighter: FC<Props> = ({ assistantId }) => {
  const { options } = useDisplay()
  const preCodeRef = useRef<HTMLPreElement>(null)

  const activeTab: TApiCallType = options.get(consts.API_CALL_ACTIVE_TAB)

  const curl = activeTab === API_CALL_TAB.CURL
  const node = activeTab === API_CALL_TAB.NODE
  const python = activeTab === API_CALL_TAB.PYTHON

  const script = curl
    ? curlTemplate
    : node
    ? nodeTemplate
    : python
    ? pythonTemplate
    : null

  const format = (template: string) => {
    const hostName = api.defaults.baseURL
    return template
      .replaceAll('http://hostname/api/', hostName!)
      .replace('assistantName', assistantId)
  }

  const formattedScript = format(script!)
  console.log('rerender')
  const handleCopyCode = () => {
    navigator.clipboard.writeText(preCodeRef?.current?.props?.children)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  return (
    <div className={s.container}>
      <div className={s.btnContainer}>
        <SwitchButtonAPICall />
        <Button theme='tertiary2' props={{ onClick: handleCopyCode }}>
          <SvgIcon iconName='copy' />
          Copy Code
        </Button>
      </div>
      <SyntaxHighlighter
        customStyle={{ margin: '0px', borderRadius: '12px' }}
        language={node ? 'js' : curl ? 'bash' : python ? 'python' : 'js'}
        style={nightOwl}
        ref={preCodeRef}
      >
        {formattedScript}
      </SyntaxHighlighter>
    </div>
  )
}
