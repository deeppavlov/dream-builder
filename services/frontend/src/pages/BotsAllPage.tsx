import { Toaster } from 'react-hot-toast'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Loader } from '../components/Loader/Loader'
import { Main } from '../components/Main/Main'
import { SignInModal } from '../components/SignInModal/SignInModal'
import { useDisplay } from '../context/DisplayContext'
import { useAssistants } from '../hooks/useAssistants'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'
import { sortDistsByISO8601 } from '../utils/sortDistsByISO8601'

export const BotsAllPage = () => {
  const { publicDists, publicDistsError, isPublicDistsLoading } =
    useAssistants()
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <>
      <Main sidebar>
        <Wrapper
          title='Virtual Assistants Templates'
          amount={publicDists?.length}
        >
          <Loader isLoading={isPublicDistsLoading} />
          <ErrorHandler error={publicDistsError} />
          {isTableView ? (
            <Table>
              <DistList view='table' dists={publicDists} type='public' />
            </Table>
          ) : (
            <Container gridForCards>
              <DistList
                view='cards'
                dists={sortDistsByISO8601(publicDists)}
                type='public'
                size='big'
              />
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <SignInModal />
        <BaseSidePanel transition='left' />
      </Main>
      <Toaster />
    </>
  )
}
