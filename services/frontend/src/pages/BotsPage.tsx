import { useState } from 'react'
import { useQuery } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { RoutesList } from '../router/RoutesList'
import { useAuth } from '../context/AuthProvider'
import { getPublicDists } from '../services/getPublicDists'
import { getPrivateDists } from '../services/getPrivateDists'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Slider } from '../ui/Slider/Slider'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { Modal } from '../components/Modal/Modal'
import { ShareModal } from '../components/ShareModal/ShareModal'
import { Loader } from '../components/Loader/Loader'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { DistList } from '../components/DistList/DistList'
import { SignInModal } from '../components/SignInModal/SignInModal'

export const BotsPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState<boolean>(false)

  const viewHandler = () => {
    setListView(listView => !listView)
  }

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
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        <Wrapper
          title='Public Virtual Assistants & Chatbots'
          showAll
          amount={publicDists?.length}
          linkTo={RoutesList.botsAll}
          fitScreen={listView}>
          <Loader isLoading={isPublicDistsLoading} />
          <ErrorHandler error={publicDistsError} />
          {listView ? (
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
          title='Your Virtual Assistants & Chatbots'
          amount={auth?.user && privateDists?.length}
          linkTo={RoutesList.yourBots}>
          {listView ? (
            <Table addButton={<AddButton listView={listView} />}>
              <DistList view='table' dists={privateDists} type='your' />
            </Table>
          ) : (
            <Container overflowForAddButton>
              <AddButton listView={listView} />
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
      </Main>
      <Toaster />
    </>
  )
}
