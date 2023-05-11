import { Toaster } from 'react-hot-toast'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import CardsLoader from '../components/CardsLoader/CardsLoader'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { DeployNotificationModal } from '../components/DeployModal/DeployNotificationModal'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Main } from '../components/Main/Main'
import { Modal } from '../components/Modal/Modal'
import { Placeholder } from '../components/PlaceHolder/PlaceHolder'
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
  const { fetchPublicDists, fetchPrivateDists } = useAssistants()
  const publicDists = fetchPublicDists()
  const privateDists = fetchPrivateDists()

  return (
    <>
      <Main sidebar>
        <Wrapper
          subWrapper
          title='Create your Assistant '
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
                  <Slider subWrapper>
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
          title='Assistants'
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
              <Slider privateAssistants>
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
                {privateDists?.data?.length === 0 && (
                  <Placeholder>You assistants will appear here</Placeholder>
                )}
                {!auth?.user && (
                  <Placeholder>Your assistants will appear here</Placeholder>
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
        <DeployNotificationModal />
      </Main>
      <Toaster />
    </>
  )
}
