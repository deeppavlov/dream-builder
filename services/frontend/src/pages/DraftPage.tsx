import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { Main } from '../components/Main/Main'
import { Wrapper } from '../ui/Wrapper/Wrapper'

export const DraftPage = () => {
  return (
    <>
      <Main>
        <Wrapper skills></Wrapper>
      </Main>
      <AssistantModal />
    </>
  )
}
