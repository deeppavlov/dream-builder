import { useState } from 'react'
import { AddButton } from '../ui/AddButton/AddButton'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Container } from '../ui/Container/Container'
import { Main } from '../components/Main/Main'
import { Table } from '../ui/Table/Table'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { YourBotCard } from '../components/YourBotCard/YourBotCard'

export const MainPage = () => {
  const [bots, setBots] = useState([])
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    setBots([])
    console.log(listView)
  }
  const addBot = () => {
    !listView
      ? setBots(bots.concat(<YourBotCard />))
      : setBots(bots.concat(<BotListItem />))
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              amount='5'
              linkTo='/bots'
              paddingBottom='12px'>
              <Container paddingBottom='22px'>
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
              </Container>
            </Wrapper>
            <Wrapper
              paddingBottom='12px'
              title='Your Virtual Assistants & Chatbots'>
              <Container paddingBottom='22px'>
                <AddButton listView={listView} addBot={addBot} />
                {bots}
              </Container>
            </Wrapper>
          </>
        ) : (
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              amount='5'
              linkTo='/bots'>
              <Table>
                <BotListItem />
                <BotListItem />
                <BotListItem />
                <BotListItem />
              </Table>
            </Wrapper>
            <Wrapper title='Your Virtual Assistants & Chatbots'>
              <Table>
                <AddButton addBot={addBot} listView={listView} />
                {bots}
              </Table>
            </Wrapper>
          </>
        )}
      </Main>
    </>
  )
}
