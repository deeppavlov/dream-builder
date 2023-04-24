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
import { useAuth } from '../context/AuthProvider'
import { useDisplay } from '../context/DisplayContext'
import { getPrivateDists } from '../services/getPrivateDists'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'

export const UsersBotsPage = () => {
  const auth = useAuth()
  const { data, error, isLoading } = useQuery('privateDists', getPrivateDists)
  const { options, dispatch } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <>
      <Main sidebar>
        <Wrapper title='Your Virtual Assistants' amount={data?.length}>
          <Loader isLoading={isLoading} />
          <ErrorHandler error={error} />
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
              <DistList view='table' dists={data} type='your' />
            </Table>
          ) : (
            <Container gridForCards>
              <AddButton forGrid />
              <DistList view='cards' dists={data} type='your' size='big' />
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <PublishAssistantModal />
        <DeleteAssistantModal />
        <ShareModal />
        <Modal />
      </Main>
      <Toaster />
    </>
  )
}
