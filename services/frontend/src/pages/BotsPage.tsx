import { useState } from 'react'
import { useQuery } from 'react-query'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'
import { getAssistantDists } from '../services/getAssistantDists'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { YourBotCard } from '../components/YourBotCard/YourBotCard'
import ReactTooltip from 'react-tooltip'
import { useAuth } from '../services/AuthProvider'

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

export const BotsPage = () => {
  const auth = useAuth()
  const [bots, setBots] = useState([])
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    setListView(!listView)
    setBots([])
  }
  const addBot = () => {
    !listView
      ? setBots(bots.concat(<YourBotCard />))
      : setBots(bots.concat(<BotListItem />))
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
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              showAll
              amount={assistantsData.length}
              linkTo='/bots'
              paddingBottom='12px'>
              <Container overflowY='hidden' paddingBottom='22px'>
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
            <Wrapper
              paddingBottom='12px'
              title='Your Virtual Assistants & Chatbots'>
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
              showAll={true}
              amount={assistantsData.length}
              linkTo='/bots'>
              <Table>
                {assistantsData?.map((dist: dist_list) => {
                  const date = dateToUTC(dist.metadata.date)
                  const time = timeToUTC(dist.metadata.date)
                  return (
                    <BotListItem
                      key={dist.name}
                      botName={dist.metadata.display_name}
                      companyName={dist.metadata.author}
                      date={date}
                      time={time}
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
            <Wrapper title='Your Virtual Assistants & Chatbots'>
              <Table
                // checkbox={true}
                addButton={<AddButton addBot={addBot} listView={listView} disabled={auth?.user === null} />}>
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
            You must be signed in to create the own bot
          </ReactTooltip>
        )}
      </Main>
    </>
  )
}
