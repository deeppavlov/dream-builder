import { Toaster } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Loader } from '../components/Loader/Loader'
import { Main } from '../components/Main/Main'
import { Modal } from '../components/Modal/Modal'
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { ShareModal } from '../components/ShareModal/ShareModal'
import { SignInModal } from '../components/SignInModal/SignInModal'
import { useAuth } from '../context/AuthProvider'
import { useDisplay } from '../context/DisplayContext'
import { RoutesList } from '../router/RoutesList'
import { getPrivateDists } from '../services/getPrivateDists'
import { getPublicDists } from '../services/getPublicDists'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Slider } from '../ui/Slider/Slider'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'

export const BotsPage = () => {
  const auth = useAuth()
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  const {
    data: publicDists,
    error: publicDistsError,
    isLoading: isPublicDistsLoading,
  } = useQuery('publicDists', getPublicDists)

  const {
    data: privateDists,
    error: privateDistsError,
    isLoading: isPrivateDistsLoading,
  } = useQuery('privateDists', getPrivateDists, {
    enabled: !!auth?.user,
  })

  return (
    <>
      <Main sidebar>
        <Wrapper
          title='Virtual Assistants Templates'
          showAll
          amount={publicDists?.length}
          linkTo={RoutesList.botsAll}
        >
          <Loader isLoading={isPublicDistsLoading} />
          <ErrorHandler error={publicDistsError} />
          {isTableView ? (
            <Table>
              <DistList view='table' dists={publicDists} type='public' />
            </Table>
          ) : (
            <Slider>
              <DistList view='cards' dists={publicDists} type='public' />
            </Slider>
          )}
        </Wrapper>
        <Wrapper
          primary
          showAll
          title='Your Virtual Assistants'
          amount={
            auth?.user && privateDists?.length > 0 && privateDists?.length
          }
          linkTo={RoutesList.yourBots}
        >
          {isTableView ? (
            <Table addButton={<AddButton forTable disabled={!auth?.user} />}>
              <DistList view='table' dists={privateDists} type='your' />
            </Table>
          ) : (
            <Container overflowForAddButton>
              <AddButton disabled={!auth?.user} />
              <Slider>
                <Loader isLoading={isPrivateDistsLoading} />
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
        <Modal />
        <SignInModal />
        <BaseSidePanel transition='left' />
      </Main>
      <Toaster />
    </>
  )
}
