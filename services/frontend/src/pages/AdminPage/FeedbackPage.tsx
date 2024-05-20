import { Gallery } from 'components/Modals'
import { FeedbackList } from 'components/Tables'
import { Main } from 'components/UI'

export const FeedbackPage = () => {
  return (
    <>
      <Main sidebar>
        <FeedbackList />
      </Main>
      <Gallery />
    </>
  )
}
