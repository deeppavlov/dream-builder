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
import { dist_list } from '../types/types'
import DeepPavlovLogo from '@assets/icons/pavlovInCard.svg'

export const BotsAllPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState(false)
  const topbarRef = useRef<HTMLDivElement | undefined>()
  const [topbarHeight, setTopbarHeight] = useState(0)

  const viewHandler = () => {
    setListView(!listView)
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

  if (isAssistantsLoading) return 'Loading...'
  if (assistantsError) return 'An error has occurred: ' + assistantsError
  return (
    <>
      <Topbar innerRef={topbarRef} viewHandler={viewHandler} type='main' />
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
                const date = dateToUTC(dist.metadata.date_created)
                return (
                  <BotCard
                    key={dist.name}
                    type='public'
                    name={dist.metadata.display_name}
                    author={dist.metadata.author}
                    authorImg={DeepPavlovLogo}
                    dateCreated={date}
                    desc={dist.metadata.description}
                    version={dist.metadata.version}
                    ram={dist.metadata.ram_usage}
                    gpu={dist.metadata.gpu_usage}
                    space={dist.metadata.disk_usage}
                    size='big'
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
            showAll={false}>
            <Table>
              {assistantsData?.map((dist: dist_list) => {
                const date = dateToUTC(dist.metadata.date_created)
                const time = timeToUTC(dist.metadata.date_created)
                return (
                  <BotListItem
                    key={dist.name}
                    name={dist.metadata.display_name}
                    author={dist.metadata.author}
                    authorImg={DeepPavlovLogo}
                    dateCreated={date}
                    time={time}
                    desc={dist.metadata.description}
                    version={dist.metadata.version}
                    ram={dist.metadata.ram_usage}
                    gpu={dist.metadata.gpu_usage}
                    space={dist.metadata.disk_usage}
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
