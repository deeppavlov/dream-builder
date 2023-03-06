import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { dateToUTC } from '../utils/dateToUTC'
import { getAssistantDists } from '../services/getAssistantDists'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { timeToUTC } from '../utils/timeToUTC'
import { useAuth } from '../context/AuthProvider'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { dist_list } from '../types/types'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { getUsersAssistantDists } from '../services/getUsersAssistantDists'
import BaseSidePanel from '../components/BaseSidePanel/BaseSidePanel'

export const UsersBotsPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState<boolean>(false)
  const topbarRef = useRef<HTMLDivElement | undefined>()

  const viewHandler = () => {
    setListView(listView => !listView)
  }

  const {
    data: usersDistData,
    isLoading: isUsersDistDataLoading,
    error: usersDistDataError,
  } = useQuery('usersAssistantDists', getUsersAssistantDists)

  return (
    <>
      <Topbar innerRef={topbarRef} viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <Wrapper
            title='Your Virtual Assistants & Chatbots'
            amount={usersDistData?.length}>
            <Container>
              {isUsersDistDataLoading && 'Loading...'}
              {usersDistDataError &&
                'luck is not on your side! try to refresh the page' +
                  usersDistDataError}
              {usersDistData?.map((dist: dist_list, i: number) => {
                const {
                  display_name,
                  name,
                  author,
                  description,
                  version,
                  ram_usage,
                  gpu_usage,
                  disk_usage,
                  date_created,
                } = dist
                const dateCreated = dateToUTC(date_created)
                return (
                  <BotCard
                    routingName={name}
                    key={i}
                    type='your'
                    size='small'
                    name={display_name}
                    author={author}
                    authorImg={DeepPavlovLogo}
                    dateCreated={dateCreated}
                    desc={description}
                    version={version}
                    ram={ram_usage}
                    gpu={gpu_usage}
                    space={disk_usage}
                    disabledMsg={
                      auth?.user
                        ? undefined
                        : 'You must be signed in to clone the bot'
                    }
                  />
                )
              })}
            </Container>
          </Wrapper>
        ) : (
          <Wrapper
            title='Your Virtual Assistants & Chatbots'
            amount={usersDistData?.length}>
            <Table>
              {usersDistData?.map((dist: dist_list, i: number) => {
                const {
                  name,
                  display_name,
                  author,
                  description,
                  version,
                  ram_usage,
                  gpu_usage,
                  disk_usage,
                  date_created,
                } = dist
                const dateCreated = dateToUTC(date_created)
                const time = timeToUTC(date_created)
                return (
                  <BotListItem
                    key={i}
                    routingName={name}
                    name={display_name}
                    author={author}
                    authorImg={DeepPavlovLogo}
                    dateCreated={dateCreated}
                    time={time}
                    desc={description}
                    version={version}
                    ram={ram_usage}
                    gpu={gpu_usage}
                    space={disk_usage}
                    disabledMsg={
                      auth?.user
                        ? undefined
                        : 'You must be signed in to clone the bot'
                    }
                  />
                )
              })}
            </Table>
          </Wrapper>
        )}
        <BaseSidePanel position={{ top: 64 }} />
        <AssistantModal />
      </Main>
    </>
  )
}
