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
import BotInfoSidePanel from '../components/BotInfoSidePanel/BotInfoSidePanel'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { dist_list } from '../types/types'
import DeepPavlovLogo from '@assets/icons/pavlovInCard.svg'
import BaseSidePanel from '../components/BaseSidePanel/BaseSidePanel'

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

  if (assistantsError) return <>{'An error has occurred: ' + assistantsError}</>
  return (
    <>
      <Topbar innerRef={topbarRef} viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <Wrapper
            title='Public Virtual Assistants & Chatbots'
            amount={assistantsData?.length}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
              {isAssistantsLoading && 'Loading...'}
              {assistantsData?.map((dist: dist_list, i: number) => {
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
                const dateCreated = dateToUTC(new Date(date_created))

                return (
                  <BotCard
                    key={i}
                    type='public'
                    size='big'
                    routingName={name}
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
            title='Public Virtual Assistants & Chatbots'
            amount={assistantsData.length}
            showAll>
            <Table>
              {assistantsData?.map((dist: dist_list, i: number) => {
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
                const dateCreated = dateToUTC(new Date(date_created))
                const time = timeToUTC(new Date(date_created))
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
        <BaseSidePanel position={{ top: topbarHeight }} />
        <AssistantModal />
      </Main>
    </>
  )
}
