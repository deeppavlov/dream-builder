import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { trigger } from '../utils/events'
import { useOnKey } from '../hooks/useOnKey'

export const DraftPage = () => {
  const onFormSubmit = (e: any) => {
    e.preventDefault()
    trigger('AssistantModal', {})
  }
  useOnKey(onFormSubmit, 'Enter')

  return (
    <>
      {/* <Topbar /> */}
      <Main>
        <form onSubmit={onFormSubmit}>
          <input type='text' />
          <button type='submit' />
        </form>
      </Main>
      <AssistantModal />
    </>
  )
}
