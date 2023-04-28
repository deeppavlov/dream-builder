import { Toaster } from 'react-hot-toast'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import CardsLoader from '../components/CardsLoader/CardsLoader'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Main } from '../components/Main/Main'
import { Modal } from '../components/Modal/Modal'
import { PublicToPrivateModal } from '../components/PublicToPrivateModal/PublicToPrivateModal'
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { ShareModal } from '../components/ShareModal/ShareModal'
import { SignInModal } from '../components/SignInModal/SignInModal'
import { useAuth } from '../context/AuthProvider'
import { useDisplay } from '../context/DisplayContext'
import { useAssistants } from '../hooks/useAssistants'
import { RoutesList } from '../router/RoutesList'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Slider } from '../ui/Slider/Slider'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'

export const BotsPage = () => {
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  const auth = useAuth()
  const { privateDists, publicDists } = useAssistants()

  return (
    <>
      <Main sidebar>
        <Wrapper
          title='Assistant Templates'
          showAll
          amount={publicDists?.data?.length}
          linkTo={RoutesList.botsAll}
        >
          {publicDists?.error ? (
            <ErrorHandler error={publicDists?.error} />
          ) : (
            <>
              {isTableView ? (
                <Table
                  addButton={<AddButton forTable disabled={!auth?.user} />}
                >
                  <DistList
                    view='table'
                    dists={publicDists?.data}
                    type='public'
                  />
                </Table>
              ) : (
                <Container overflowForAddButton>
                  <AddButton disabled={!auth?.user} />
                  <Slider>
                    {publicDists?.isLoading && <CardsLoader cardsCount={6} />}
                    <DistList
                      view='cards'
                      dists={publicDists?.data}
                      type='public'
                    />
                  </Slider>
                </Container>
              )}
            </>
          )}
        </Wrapper>
        <Wrapper
          primary
          showAll
          title='Your Assistants'
          amount={
            auth?.user &&
            privateDists?.data?.length > 0 &&
            privateDists?.data?.length
          }
          linkTo={RoutesList.yourBots}
        >
          {isTableView ? (
            <Table fourth='Visibility'>
              <DistList view='table' dists={privateDists?.data} type='your' />
            </Table>
          ) : (
            <Container overflowForAddButton>
              <Slider>
                {auth?.user && privateDists?.isLoading && (
                  <CardsLoader cardsCount={6} />
                )}
                {privateDists?.error ? (
                  <ErrorHandler error={privateDists?.error} />
                ) : (
                  <DistList
                    view='cards'
                    dists={privateDists?.data}
                    type='your'
                  />
                )}
              </Slider>
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <PublishAssistantModal />
        <DeleteAssistantModal />
        <ShareModal />
        <PublicToPrivateModal />
        <Modal />
        <SignInModal />
        <BaseSidePanel transition='left' />
      </Main>
      <Toaster />
    </>
  )
}
