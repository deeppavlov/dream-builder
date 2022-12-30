import { forwardRef, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import ReactTooltip from 'react-tooltip'
import { RoutesList } from '../Router/RoutesList'
import { useAuth } from '../services/AuthProvider'
import { getAssistantDists } from '../services/getAssistantDists'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { YourBotCard } from '../components/YourBotCard/YourBotCard'
import { Slider } from '../ui/Slider/Slider'
import { trigger } from '../utils/events'
import BotInfoSidePanel from '../components/BotInfoSidePanel/BotInfoSidePanel'
import { CreateAssistantModal } from '../components/CreateAssistantModal/CreateAssistantModal'
import { nanoid } from 'nanoid'

interface dist_list {
  name: string
  metadata: {
    display_name: string
    date_created: string | number | Date
    author: string
    description: string
    version: string
    ram_usage: string
    gpu_usage: string
    disk_usage: string
  }
}

export const BotsPage = () => {
  const auth = useAuth()
  const [bots, setBots] = useState<JSX.Element[]>([])
  const [listView, setListView] = useState<boolean>(false)
  const topbarRef = useRef<HTMLDivElement | undefined>()
  const [topbarHeight, setTopbarHeight] = useState(0)

  const viewHandler = () => {
    setListView(listView => !listView)
    setBots([])
  }
  const addBot = () => {
    !listView
      ? setBots(
          bots.concat([
            <YourBotCard
              key={nanoid(8)}
              dateCreated={dateToUTC(new Date())}
              author={auth?.user?.name}
              version='0.01'
              name='Name of The Bot'
              desc='Small description about the project maximum 4 lines. Small description about the project maximum'
              disabledMsg={
                auth?.user
                  ? undefined
                  : 'You must be signed in to clone the bot'
              }
            />,
          ])
        )
      : setBots(
          bots.concat([
            <BotListItem
              key={nanoid(8)}
              dateCreated={dateToUTC(new Date())}
              author={auth?.user?.name ?? 'Name of Company'}
              version='0.01'
              name='Name of The Bot'
              desc='Small description about the project maximum 4 lines. Small description about the project maximum'
              ram='0.0 GB'
              gpu='0.0 GB'
              space='0.0 GB'
              disabledMsg={
                auth?.user
                  ? undefined
                  : 'You must be signed in to clone the bot'
              }
            />,
          ])
        )
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

  assistantsError && <>An error has occurred: + {assistantsError}</>
  console.log(assistantsData)
  return (
    <>
      <Topbar innerRef={topbarRef} viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              amount={assistantsData?.length}
              linkTo={RoutesList.botsAll}
              showAll>
              <Container>
                <Slider>
                  {isAssistantsLoading && <>Loading...</>}
                  {assistantsData?.map((dist: dist_list, i: number) => {
                    const {
                      display_name,
                      author,
                      description,
                      version,
                      ram_usage,
                      gpu_usage,
                      disk_usage,
                      date_created,
                    } = dist?.metadata
                    const dateCreated = dateToUTC(date_created)
                    return (
                      <BotCard
                        routingName={dist.name}
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
                </Slider>
              </Container>
            </Wrapper>
            <Wrapper title='Your Virtual Assistants & Chatbots'>
              <Container overflow='hidden'>
                <Container
                  position='sticky'
                  left='0'
                  top='0'
                  width='275px'
                  minWidth='275px'
                  overflow='hidden'
                  padding='0'
                  paddingBottom='22px'>
                  <div data-tip data-for='add-btn-new-bot'>
                    <AddButton
                      listView={listView}
                      addBot={addBot}
                      disabled={auth?.user === null}
                    />
                  </div>
                </Container>
                <Container paddingBottom='22px'>{bots}</Container>
              </Container>
            </Wrapper>
          </>
        ) : (
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              showAll
              amount={assistantsData.length}
              linkTo={RoutesList.botsAll}
              fitScreen>
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
                  const time = timeToUTC(dist?.metadata?.date)
                  return (
                    <BotListItem
                      key={i}
                      routingName={dist.name}
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
            <Wrapper title='Your Virtual Assistants & Chatbots'>
              <Table
                addButton={
                  <AddButton
                    addBot={addBot}
                    listView={listView}
                    disabled={auth?.user === null}
                  />
                }>
                {bots}
              </Table>
            </Wrapper>
          </>
        )}
        {auth?.user === null && (
          <ReactTooltip
            place='bottom'
            effect='solid'
            className='tooltips'
            arrowColor='#8d96b5'
            delayShow={1000}
            id='add-btn-new-bot'>
            You must be signed in to create your own bot
          </ReactTooltip>
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
