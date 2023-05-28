import { useDisplay } from 'context'
import { FC, useRef } from 'react'
import toast from 'react-hot-toast'
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light'
import curlTemplate from 'assets/scripts/curl.bash?raw'
import nodeTemplate from 'assets/scripts/node.js?raw'
import pythonTemplate from 'assets/scripts/python.py?raw'
import { TApiCallType } from 'types/types'
import { API_CALL_TAB } from 'constants/constants'
import { api } from 'api/axiosConfig'
import { consts } from 'utils/consts'
import { Button, SwitchButtonAPICall } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { ToastCopySucces } from 'components/UI'
import s from './ApiCallCode.module.scss'

interface Props {
  assistantId: string
}

export const ApiCallCode: FC<Props> = ({ assistantId }) => {
  const { options } = useDisplay()
  const preCodeRef = useRef<HTMLPreElement>(null)

  const activeTab: TApiCallType = options.get(consts.API_CALL_ACTIVE_TAB)

  const curl = activeTab === API_CALL_TAB.CURL
  const node = activeTab === API_CALL_TAB.NODE
  const python = activeTab === API_CALL_TAB.PYTHON

  const language = node ? 'js' : curl ? 'bash' : python ? 'python' : 'js'

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
      .replaceAll('https://hostname/api/', hostName!)
      .replaceAll('assistantName', assistantId)
  }

  const formattedScript = format(script!)
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
        language={language}
        style={nightOwl}
        // ref={preCodeRef}
      >
        {formattedScript}
      </SyntaxHighlighter>
    </div>
  )
}
