import { Toaster } from 'react-hot-toast'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import CardsLoader from '../components/CardsLoader/CardsLoader'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Main } from '../components/Main/Main'
import { Modal } from '../components/Modal/Modal'
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { ShareModal } from '../components/ShareModal/ShareModal'
import { useAuth } from '../context/AuthProvider'
import { useDisplay } from '../context/DisplayContext'
import { useAssistants } from '../hooks/useAssistants'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'

export const UsersBotsPage = () => {
  const auth = useAuth()
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  const { privateDists, privateDistsError, isPrivateDistsLoading } =
    useAssistants()

  return (
    <>
      <Main sidebar>
        <Wrapper primary title='Your Assistants' amount={privateDists?.length}>
          {privateDistsError ? (
            <ErrorHandler error={privateDistsError} />
          ) : (
            <>
              {isTableView ? (
                <Table
                  addButton={
                    <AddButton
                      forTable
                      disabled={!auth?.user}
                      text='Create From Scratch'
                    />
                  }
                >
                  <DistList view='table' dists={privateDists} type='your' />
                </Table>
              ) : (
                <Container gridForCards>
                  <AddButton forGrid />
                  {isPrivateDistsLoading && (
                    <CardsLoader cardsCount={6} type='bot' />
                  )}
                  <DistList
                    view='cards'
                    dists={privateDists}
                    type='your'
                    size='big'
                  />
                </Container>
              )}
            </>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <PublishAssistantModal />
        <DeleteAssistantModal />
        <ShareModal />
        <Modal />
        <BaseSidePanel transition='left' />
      </Main>
      <Toaster />
    </>
  )
}
