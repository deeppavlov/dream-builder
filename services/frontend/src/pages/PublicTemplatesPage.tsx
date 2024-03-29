import { useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { useAssistants } from 'hooks/api'
import { consts } from 'utils/consts'
import { getAssistantTableHeaders } from 'utils/getAssistantTableHeaders'
import { DistList } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import { AssistantModal, SignInModal } from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container, ErrorHandler, Main, Table, Wrapper } from 'components/UI'

export const PublicTemplatesPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'public_templates_page',
  })
  const { fetchPublicDists } = useAssistants()
  const publicDists = fetchPublicDists()
  const { UIOptions } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

  const tableHeaders = getAssistantTableHeaders('public')

  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper title={t('wrapper.title')} amount={publicDists?.data?.length}>
          {publicDists?.error ? (
            <ErrorHandler error={publicDists.error} />
          ) : (
            <>
              {isTableView ? (
                <Table
                headers={tableHeaders}
                >
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
      </Main>
    </>
  )
}
