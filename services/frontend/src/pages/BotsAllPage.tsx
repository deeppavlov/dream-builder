import { useState } from 'react'
import { useQuery } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { getPublicDists } from '../services/getPublicDists'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { Loader } from '../components/Loader/Loader'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { DistList } from '../components/DistList/DistList'

export const BotsAllPage = () => {
  const [listView, setListView] = useState<boolean>(false)
  const { data, error, isLoading } = useQuery('publicDists', getPublicDists)
  const viewHandler = () => {
    setListView(listView => !listView)
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        <Wrapper
          title='Public Virtual Assistants & Chatbots'
          amount={data?.length}>
          <Loader isLoading={isLoading} />
          <ErrorHandler error={error} />
          {listView ? (
            <Table>
              <DistList view='table' dists={data} type='public' />
            </Table>
          ) : (
            <Container gridForCards>
              <DistList view='cards' dists={data} type='public' size='big' />
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
      </Main>
      <Toaster />
    </>
  )
}
