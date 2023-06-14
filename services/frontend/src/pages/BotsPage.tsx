import { useAuth, useUIOptions } from 'context'
import { Toaster } from 'react-hot-toast'
import { RoutesList } from 'router/RoutesList'
import { useAssistants } from 'hooks/api'
import { consts } from 'utils/consts'
import { AddButton } from 'components/Buttons'
import { DistList } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import {
  AssistantModal,
  CongratsModal,
  DeleteAssistantModal,
  DeployNotificationModal,
  PublicToPrivateModal,
  PublishAssistantModal,
  ShareAssistantModal,
  SignInModal,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import {
  Container,
  ErrorHandler,
  Main,
  Placeholder,
  Slider,
  Table,
  Wrapper,
} from 'components/UI'

export const BotsPage = () => {
  const { UIOptions } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]
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
          fitScreen={isTableView}
          table
        >
          {publicDists?.error ? (
            <ErrorHandler error={publicDists?.error} />
          ) : (
            <>
              {isTableView ? (
                <Table
                  assistants
                  addButton={<AddButton forTable disabled={!auth?.user} />}
                >
                  {publicDists?.isLoading && (
                    <TableRowsLoader rowsCount={4} colCount={6} />
                  )}
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
          title='Your Assistants'
          amount={
            auth?.user &&
            privateDists?.data?.length > 0 &&
            privateDists?.data?.length
          }
          linkTo={RoutesList.yourBots}
        >
          {isTableView ? (
            <>
              <Table
                assistants
                addButton={
                  privateDists?.data?.length === 0 || !auth?.user ? (
                    <Placeholder type='table'>
                      Your assistants will appear here
                    </Placeholder>
                  ) : undefined
                }
              >
                {publicDists?.isLoading && (
                  <TableRowsLoader rowsCount={2} colCount={6} />
                )}
                <DistList view='table' dists={privateDists?.data} type='your' />
              </Table>
            </>
          ) : (
            <Container>
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
                {privateDists?.data?.length === 0 || !auth?.user ? (
                  <Placeholder>Your assistants will appear here</Placeholder>
                ) : null}
              </Slider>
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <PublishAssistantModal />
        <DeleteAssistantModal />
        <ShareAssistantModal />
        <PublicToPrivateModal />
        <CongratsModal />
        <SignInModal />
        <DeployNotificationModal />
      </Main>
      <Toaster />
    </>
  )
}
