import { useUIOptions } from 'context'
import { useAssistants } from 'hooks/api'
import { consts } from 'utils/consts'
import { DistList } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import {
  AssistantModal,
  DeployNotificationModal,
  SignInModal,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container, ErrorHandler, Main, Table, Wrapper } from 'components/UI'

export const BotsAllPage = () => {
  const { fetchPublicDists } = useAssistants()
  const publicDists = fetchPublicDists()
  const { UIOptions } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper title='Public Templates' amount={publicDists?.data?.length}>
          {publicDists?.error ? (
            <ErrorHandler error={publicDists.error} />
          ) : (
            <>
              {isTableView ? (
                <Table assistants>
                  {publicDists?.isLoading && (
                    <TableRowsLoader rowsCount={6} colCount={6} />
                  )}
                  <DistList
                    view='table'
                    dists={publicDists?.data!}
                    type='public'
                  />
                </Table>
              ) : (
                <Container gridForCards heightAuto>
                  {publicDists?.isLoading && (
                    <CardsLoader cardsCount={6} type='bot' />
                  )}
                  <DistList
                    view='cards'
                    dists={publicDists?.data!}
                    type='public'
                    size='big'
                  />
                </Container>
              )}
            </>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <SignInModal />
        <DeployNotificationModal />
      </Main>
    </>
  )
}
