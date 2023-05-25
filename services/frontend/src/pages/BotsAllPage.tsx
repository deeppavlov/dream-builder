import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import CardsLoader from '../components/CardsLoader/CardsLoader'
import { DeployNotificationModal } from '../components/DeployModal/DeployNotificationModal'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Main } from '../components/Main/Main'
import { SignInModal } from '../components/SignInModal/SignInModal'
import TableRowsLoader from '../components/TableRowsLoader/TableRowsLoader'
import { useDisplay } from '../context/DisplayContext'
import { useAssistants } from '../hooks/useAssistants'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'

export const BotsAllPage = () => {
  const { options } = useDisplay()
  const { t } = useTranslation()
  const { fetchPublicDists } = useAssistants()
  const publicDists = fetchPublicDists()
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  return (
    <>
      <Main sidebar fullWidth>
        <Wrapper
          title={t('wrapper.title.public_assistants')}
          amount={publicDists?.data?.length}
        >
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
                    dists={publicDists?.data}
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
                    dists={publicDists?.data}
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
      <Toaster />
    </>
  )
}
