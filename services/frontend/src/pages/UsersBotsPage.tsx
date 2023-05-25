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
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { ShareAssistantModal } from '../components/ShareAssistantModal/ShareAssistantModal'
import TableRowsLoader from '../components/TableRowsLoader/TableRowsLoader'
import { useAuth } from '../context/AuthProvider'
import { useDisplay } from '../context/DisplayContext'
import { useAssistants } from '../hooks/useAssistants'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'
import { useTranslation } from 'react-i18next'

export const UsersBotsPage = () => {
  const auth = useAuth()
  const { options } = useDisplay()
  const { t } = useTranslation()
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  const { fetchPrivateDists } = useAssistants()
  const privateDists = fetchPrivateDists()
  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper
          primary
          title={t('wrapper.title.your_assistants')}
          amount={privateDists?.data?.length > 0 && privateDists?.data?.length}
          // fullHeight
        >
          {privateDists?.error ? (
            <ErrorHandler error={privateDists?.error} />
          ) : (
            <>
              {isTableView ? (
                <Table
                  assistants
                  addButton={
                    <AddButton
                      forTable
                      disabled={!auth?.user}
                      text='Create From Scratch'
                    />
                  }
                >
                  {privateDists?.isLoading && (
                    <TableRowsLoader rowsCount={6} colCount={6} />
                  )}
                  <DistList
                    view='table'
                    dists={privateDists?.data}
                    type='your'
                  />
                </Table>
              ) : (
                <Container gridForCards heightAuto>
                  <AddButton forGrid />
                  {privateDists?.isLoading && (
                    <CardsLoader cardsCount={6} type='bot' />
                  )}
                  <DistList
                    view='cards'
                    dists={privateDists?.data}
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
        <ShareAssistantModal />
        <Modal />
        <DeployNotificationModal />
      </Main>
      <Toaster />
    </>
  )
}
