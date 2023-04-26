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
import { SignInModal } from '../components/SignInModal/SignInModal'
import { useDisplay } from '../context/DisplayContext'
import { consts } from '../utils/consts'

export const BotsAllPage = () => {
  const { data, error, isLoading } = useQuery('publicDists', getPublicDists)
  const { options, dispatch } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <>
      {/* <Topbar viewHandler={viewHandler} type='main' /> */}
      <Main>
        <Wrapper
          title='Assistant Templates'
          amount={data?.length}>
          <Loader isLoading={isLoading} />
          <ErrorHandler error={error} />
          {isTableView ? (
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
        <SignInModal />
      </Main>
      <Toaster />
    </>
  )
}
