import { useDisplay } from 'context'
import { useParams } from 'react-router-dom'
import { INTEGRATION_ACTIVE_TAB } from 'constants/constants'
import { consts } from 'utils/consts'
import { SwitchButton } from 'components/Buttons'
import { ApiCallCode, WebChatCode } from 'components/CodeHighlighters'
import { AssistantModule } from 'components/Modules'
import { Container, Details, Main, Wrapper } from 'components/UI'

export const IntegrationPage = () => {
  const { name } = useParams()
  const { options } = useDisplay()

  const activeTab = options.get(consts.INTEGRATION_ACTIVE_TAB)
  const webChat = activeTab === INTEGRATION_ACTIVE_TAB.CHAT
  const apiCall = activeTab === INTEGRATION_ACTIVE_TAB.API

  const webChatDescription =
    'Web Chat: add the code below and paste it into your website to embed the chat widget'
  const apiCallDescription = 'Dialog API: API Call Examples'

  const chatDescription = webChat
    ? webChatDescription
    : apiCall
    ? apiCallDescription
    : ''

  return (
    <>
      <Main sidebar>
        <AssistantModule />
        <Wrapper fitScreen title='Integration' btns={<SwitchButton />}>
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
