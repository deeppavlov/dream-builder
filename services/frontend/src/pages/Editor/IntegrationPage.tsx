import { useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { INTEGRATION_ACTIVE_TAB } from 'constants/constants'
import { consts } from 'utils/consts'
import { SwitchButton } from 'components/Buttons'
import { ApiCallCode, WebChatCode } from 'components/CodeHighlighters'
import { AssistantModule } from 'components/Modules'
import { Container, Details, Main, Wrapper } from 'components/UI'

export const IntegrationPage = () => {
  const { name } = useParams()
  const { UIOptions } = useUIOptions()
  const { t } = useTranslation('translation', {
    keyPrefix: 'assistant_page.integration_tab',
  })

  const activeTab = UIOptions[consts.INTEGRATION_ACTIVE_TAB]
  const webChat = activeTab === INTEGRATION_ACTIVE_TAB.CHAT
  const apiCall = activeTab === INTEGRATION_ACTIVE_TAB.API

  const webChatDescription = t('wrapper.annotation.web_chat')
  const apiCallDescription = t('wrapper.annotation.api_call')

  const chatDescription = webChat
    ? webChatDescription
    : apiCall
    ? apiCallDescription
    : ''

  return (
    <>
      <Main sidebar>
        <AssistantModule />
        <Wrapper fitScreen title={t('wrapper.title')} btns={<SwitchButton />}>
          <Details>{chatDescription}</Details>
          <Container column>
            {webChat && <WebChatCode assistantId={name!} />}
            {apiCall && <ApiCallCode assistantId={name!} />}
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
