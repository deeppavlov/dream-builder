import { useState } from 'react'
import { useQuery } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { getPrivateDists } from '../services/getPrivateDists'
import { dateToUTC } from '../utils/dateToUTC'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { timeToUTC } from '../utils/timeToUTC'
import { useAuth } from '../context/AuthProvider'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { Modal } from '../components/Modal/Modal'
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { ShareModal } from '../components/ShareModal/ShareModal'
import { Loader } from '../components/Loader/Loader'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
import { DistList } from '../components/DistList/DistList'
import { AddButton } from '../ui/AddButton/AddButton'
import { useDisplay } from '../context/DisplayContext'
import { consts } from '../utils/consts'

export const UsersBotsPage = () => {
  const auth = useAuth()
  const { data, error, isLoading } = useQuery('privateDists', getPrivateDists)
  const { options, dispatch } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <>
      <Main>
        <Wrapper
          title='Your Virtual Assistants & Chatbots'
          amount={data?.length}>
          <Loader isLoading={isLoading} />
          <ErrorHandler error={error} />
          {isTableView ? (
            <Table
              addButton={
                <AddButton
                  forTable
                  disabled={!auth?.user}
                  text='Create From Scratch'
                />
              }>
              <DistList view='table' dists={data} type='your' />
            </Table>
          ) : (
            <Container gridForCards>
              <AddButton forGrid />
              <DistList view='cards' dists={data} type='your' size='big' />
            </Container>
          )}
        </Wrapper>
        <BaseSidePanel />
        <AssistantModal />
        <PublishAssistantModal />
        <DeleteAssistantModal />
        <ShareModal />
        <Modal />
      </Main>
      <Toaster />
    </>
  )
}
