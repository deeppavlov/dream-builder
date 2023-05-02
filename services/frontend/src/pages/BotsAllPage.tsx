import { Toaster } from 'react-hot-toast'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import CardsLoader from '../components/CardsLoader/CardsLoader'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Main } from '../components/Main/Main'
import { SignInModal } from '../components/SignInModal/SignInModal'
import { useDisplay } from '../context/DisplayContext'
import { useAssistants } from '../hooks/useAssistants'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'
import { sortDistsByISO8601 } from '../utils/sortDistsByISO8601'
import { DeployModalNotification } from '../components/DeployModal/DeployModalNotification'

export const BotsAllPage = () => {
  const { publicDists } = useAssistants()
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper title='Assistant Templates' amount={publicDists?.data?.length}>
          {publicDists?.error ? (
            <ErrorHandler error={publicDists.error} />
          ) : (
            <>
              {isTableView ? (
                <Table>
                  <DistList
                    view='table'
                    dists={publicDists?.data}
                    type='public'
                  />
                </Table>
              ) : (
                <Container gridForCards heightAuto>
                  {publicDists?.isLoading && (
                    <CardsLoader cardsCount={6} type='bot' />
                  )}
                  <DistList
                    view='cards'
                    dists={sortDistsByISO8601(publicDists?.data)}
                    type='public'
                    size='big'
                  />
                </Container>
              )}
            </>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <SignInModal />
        <DeployModalNotification />
      </Main>
      <Toaster />
    </>
  )
}
