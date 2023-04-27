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
  const {
    privateDists,
    privateDistsError,
    isPrivateDistsLoading,
    publicDists,
    publicDistsError,
    isPublicDistsLoading,
  } = useAssistants()

  return (
    <>
      <Main sidebar>
        <Wrapper
          title='Assistant Templates'
          showAll
          amount={publicDists?.length}
          linkTo={RoutesList.botsAll}
        >
          {isTableView ? (
            <Table addButton={<AddButton forTable disabled={!auth?.user} />}>
              <DistList view='table' dists={publicDists} type='public' />
            </Table>
          ) : (
            <Container overflowForAddButton>
              <AddButton disabled={!auth?.user} />
              <Slider>
                {isPublicDistsLoading && <CardsLoader cardsCount={6} />}
                <ErrorHandler error={publicDistsError} />
                <DistList view='cards' dists={publicDists} type='public' />
              </Slider>
            </Container>
          )}
        </Wrapper>
        <Wrapper
          primary
          showAll
          title='Your Assistants'
          amount={
            auth?.user && privateDists?.length > 0 && privateDists?.length
          }
          linkTo={RoutesList.yourBots}
        >
          {isTableView ? (
            <Table fourth='Visibility'>
              <DistList view='table' dists={privateDists} type='your' />
            </Table>
          ) : (
            <Container overflowForAddButton>
              
              <Slider>
                {auth?.user && isPrivateDistsLoading && (
                  <CardsLoader cardsCount={6} />
                )}
                <ErrorHandler error={privateDistsError} />
                <DistList view='cards' dists={privateDists} type='your' />
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
