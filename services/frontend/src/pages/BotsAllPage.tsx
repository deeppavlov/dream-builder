import { Toaster } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { DistList } from '../components/DistList/DistList'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { Loader } from '../components/Loader/Loader'
import { Main } from '../components/Main/Main'
import { SignInModal } from '../components/SignInModal/SignInModal'
import { useDisplay } from '../context/DisplayContext'
import { getPublicDists } from '../services/getPublicDists'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { consts } from '../utils/consts'
import { sortDistsByISO8601 } from '../utils/sortDistsByISO8601'

export const BotsAllPage = () => {
  const { data, error, isLoading } = useQuery('publicDists', getPublicDists)
  const { options } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <>
      <Main sidebar>
        <Wrapper title='Virtual Assistants Templates' amount={data?.length}>
          <Loader isLoading={isLoading} />
          <ErrorHandler error={error} />
          {isTableView ? (
            <Table>
              <DistList view='table' dists={data} type='public' />
            </Table>
          ) : (
            <Container gridForCards>
              <DistList
                view='cards'
                dists={sortDistsByISO8601(data)}
                type='public'
                size='big'
              />
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <SignInModal />
      </Main>
      <Toaster />
    </>
  )
}
