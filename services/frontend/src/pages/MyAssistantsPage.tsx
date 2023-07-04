import { useAuth, useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { useAssistants } from 'hooks/api'
import { consts } from 'utils/consts'
import { AddButton } from 'components/Buttons'
import { DistList } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import {
  AssistantModal,
  DeleteAssistantModal,
  PublishAssistantModal,
  ShareAssistantModal,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container, ErrorHandler, Main, Table, Wrapper } from 'components/UI'

export const MyAssistantsPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'your_assistants_page',
  })
  const auth = useAuth()
  const { UIOptions } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]
  const { fetchPrivateDists } = useAssistants()
  const privateDists = fetchPrivateDists()

  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper
          primary
          title={t('wrapper.title')}
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
                    <AddButton forTable fromScratch disabled={!auth?.user} />
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
      </Main>
    </>
  )
}
