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
import { useAuth } from '../services/AuthProvider'
import BotInfoSidePanel from '../components/BotInfoSidePanel/BotInfoSidePanel'
import { CreateAssistantModal } from '../components/CreateAssistantModal/CreateAssistantModal'

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
  const auth = useAuth()
  const [listView, setListView] = useState<boolean>(false)
  const topbarRef = useRef<HTMLDivElement | undefined>()
  const [topbarHeight, setTopbarHeight] = useState(0)

  const viewHandler = () => {
    setListView(listView => !listView)
  }
  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistantsData,
  } = useQuery('assistant_dists', getAssistantDists)

  useEffect(() => {
    if (!isAssistantsLoading) {
      setTopbarHeight(topbarRef.current?.getBoundingClientRect().height ?? 0)
    }
  }, [isAssistantsLoading]) // Await when Topbar will mounted for calc his height in DOM

  if (isAssistantsLoading) return <> {'Loading...'}</>
  if (assistantsError) return <>{'An error has occurred: ' + assistantsError}</>
  return (
    <>
      <Topbar innerRef={topbarRef} viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <Wrapper
            title='Public Virtual Assistants & Chatbots'
            amount={assistantsData.length}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
              {assistantsData?.map((dist: dist_list, i: number) => {
                const {
                  display_name,
                  author,
                  description,
                  version,
                  ram_usage,
                  gpu_usage,
                  disk_usage,
                  date,
                } = dist.metadata
                const dateCreated = dateToUTC(date)
                return (
                  <BotCard
                    key={i}
                    name={display_name}
                    author={author}
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
            title='Public Virtual Assistants & Chatbots'
            amount={assistantsData.length}
            showAll>
            <Table>
              {assistantsData?.map((dist: dist_list, i: number) => {
                const {
                  display_name,
                  author,
                  description,
                  version,
                  ram_usage,
                  gpu_usage,
                  disk_usage,
                  date,
                } = dist.metadata
                const dateCreated = dateToUTC(date)
                const time = timeToUTC(dist.metadata.date)
                return (
                  <BotListItem
                    key={i}
                    name={display_name}
                    author={author}
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
        <BotInfoSidePanel
          disabledMsg={
            auth?.user ? undefined : 'You must be signed in to clone the bot'
          }
          position={{ top: topbarHeight }}
        />
        <CreateAssistantModal />
      </Main>
    </>
  )
}
