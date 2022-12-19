import { useState } from 'react'
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

interface dist_list {
  name: string
  metadata: {
    display_name: string
    date: string | number | Date
    author: string
    description: string
    version: string
    ram_usage: string
    gpu_usage: string
    disk_usage: string
  }
}

export const BotsAllPage = () => {
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    setListView(!listView)
  }
  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistantsData,
  } = useQuery('assistant_dists', getAssistantDists)
  if (isAssistantsLoading) return 'Loading...'
  if (assistantsError) return 'An error has occurred: ' + assistantsError
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <Wrapper
            title='Public Virtual Assistants & Chatbots'
            amount={assistantsData.length}
            showAll={false}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
              {assistantsData?.map((dist: dist_list) => {
                const date = dateToUTC(dist.metadata.date)
                return (
                  <BotCard
                    key={dist.name}
                    botName={dist.metadata.display_name}
                    companyName={dist.metadata.author}
                    date={date}
                    description={dist.metadata.description}
                    version={dist.metadata.version}
                    ram={dist.metadata.ram_usage}
                    gpu={dist.metadata.gpu_usage}
                    space={dist.metadata.disk_usage}
                  />
                )
              })}
            </Container>
          </Wrapper>
        ) : (
          <Wrapper
            title='Public Virtual Assistants & Chatbots'
            amount={assistantsData.length}
            showAll={false}>
            <Table>
              {assistantsData?.map((dist: dist_list) => {
                const date = dateToUTC(dist.metadata.date)
                const time = timeToUTC(dist.metadata.date)
                return (
                  <BotListItem
                    date={date}
                    time={time}
                    key={dist.name}
                    botName={dist.metadata.display_name}
                    companyName={dist.metadata.author}
                    description={dist.metadata.description}
                    version={dist.metadata.version}
                    ram={dist.metadata.ram_usage}
                    gpu={dist.metadata.gpu_usage}
                    space={dist.metadata.disk_usage}
                  />
                )
              })}
            </Table>
          </Wrapper>
        )}
      </Main>
    </>
  )
}
