import { useUIOptions } from 'context'
import { FC } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import curlTemplate from 'assets/scripts/curl.bash?raw'
import nodeTemplate from 'assets/scripts/node.js?raw'
import pythonTemplate from 'assets/scripts/python.py?raw'
import { API_CALL_TAB, TApiCallType } from 'types/types'
import { api } from 'api/axiosConfig'
import { consts } from 'utils/consts'
import { Button, SwitchButtonAPICall } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { ToastCopySucces } from 'components/UI'
import s from './ApiCallCode.module.scss'

interface Props {
  assistantId: string
}

enum INTEGRATION_LANG {
  CURL = 'bash',
  NODE = 'js',
  PYTHON = 'python',
}
// TODO - add loader?
export const ApiCallCode: FC<Props> = ({ assistantId }) => {
  const { UIOptions } = useUIOptions()
  const { t } = useTranslation()

  const activeTab: TApiCallType = UIOptions[consts.API_CALL_ACTIVE_TAB]

  const language: Record<TApiCallType, INTEGRATION_LANG> = {
    [API_CALL_TAB.CURL]: INTEGRATION_LANG.CURL,
    [API_CALL_TAB.NODE]: INTEGRATION_LANG.NODE,
    [API_CALL_TAB.PYTHON]: INTEGRATION_LANG.PYTHON,
  }

  const script: Record<TApiCallType, string> = {
    [API_CALL_TAB.CURL]: curlTemplate,
    [API_CALL_TAB.NODE]: nodeTemplate,
    [API_CALL_TAB.PYTHON]: pythonTemplate,
  }

  const formatScript = (scriptTemplate: string) => {
    const hostName = api.defaults.baseURL
    return scriptTemplate
      .replaceAll('https://hostname/api/', hostName!)
      .replaceAll('assistantName', assistantId)
  }

  const formattedScript = formatScript(script[activeTab])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(formattedScript)
    toast.custom(t => (t.visible ? <ToastCopySucces /> : null), {
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
          {t('assistant_page.integration_tab.wrapper.btns.copy_code')}
        </Button>
      </div>
      <SyntaxHighlighter
        customStyle={{ margin: '0px', borderRadius: '12px' }}
        language={language[activeTab]}
        style={nightOwl}
      >
        {formattedScript}
      </SyntaxHighlighter>
    </div>
  )
}
