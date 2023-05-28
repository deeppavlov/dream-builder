import { useAuth, useDisplay } from 'context'
import { Toaster } from 'react-hot-toast'
import { useAssistants } from 'hooks/api'
import { consts } from 'utils/consts'
import { AddButton } from 'components/Buttons'
import { DistList } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import {
  AssistantModal,
  DeleteAssistantModal,
  DeployNotificationModal,
  Modal,
  PublishAssistantModal,
  ShareAssistantModal,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container, ErrorHandler, Main, Table, Wrapper } from 'components/UI'

export const UsersBotsPage = () => {
  const auth = useAuth()
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  const { fetchPrivateDists } = useAssistants()
  const privateDists = fetchPrivateDists()

  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper
          primary
          title='Your Assistants'
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
