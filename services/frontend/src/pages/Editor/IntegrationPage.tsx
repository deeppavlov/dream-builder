import { useParams } from 'react-router-dom'
import { ApiCallCodeHighlighter } from '../../components/ApiCallHighLighter/ApiCallCodeHighlighter'
import { AssistantModule } from '../../components/AssistantModule/AssistantModule'
import { Details } from '../../components/Details/Details'
import { Main } from '../../components/Main/Main'
import { SwitchButton } from '../../components/SwitchButton/SwitchButton'
import { WebChatCodeHighlighter } from '../../components/WebChatCodeHighlighter/WebChatCodeHighlighter'
import { INTEGRATION_ACTIVE_TAB } from '../../constants/constants'
import { useUIOptions } from '../../context/UIOptionsContext'
import { Container } from '../../ui/Container/Container'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { consts } from '../../utils/consts'

export const IntegrationPage = () => {
  const { name } = useParams()
  const { UIOptions } = useUIOptions()

  const activeTab = UIOptions[consts.INTEGRATION_ACTIVE_TAB]
  const webChat = activeTab === INTEGRATION_ACTIVE_TAB.CHAT
  const apiCall = activeTab === INTEGRATION_ACTIVE_TAB.API

  const webChatDescription =
    'Web Chat: add the code below and paste it into your website to embed the chat widget'
  const apiCallDescription = 'Dialog API: API Call Examples'
  return (
    <>
      <Main sidebar>
        <AssistantModule />
        <Wrapper fitScreen title='Integration' btns={<SwitchButton />}>
          <Details>
            {webChat ? webChatDescription : apiCall ? apiCallDescription : ''}
          </Details>
          <Container column>
            {webChat && <WebChatCodeHighlighter assistantId={name!} />}
            {apiCall && <ApiCallCodeHighlighter assistantId={name!} />}
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
