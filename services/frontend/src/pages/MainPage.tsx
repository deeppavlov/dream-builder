import { useState } from 'react'
import { AddBotCard } from '../components/AddBotCard/AddBotCard'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Table } from '../components/Table/Table'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'
import { YourBotCard } from '../components/YourBotCard/YourBotCard'

export const MainPage = () => {
  const [botCards, setBotCards] = useState([])
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    console.log(listView)
  }
  const addCard = () => {
    setBotCards(botCards.concat(<YourBotCard />))
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        <Container flexDirection='column'>
          {!listView ? (
            <Wrapper
              alignItems='start'
              title='Public Bots'
              amount='5'
              linkTo='/bots'>
              <Container justifyContent='start' flexDirection='row'>
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
                <BotCard />
              </Container>
            </Wrapper>
          ) : (
            <Wrapper>
              <Table>
                <BotListItem />
                <BotListItem />
                <BotListItem />
                <BotListItem />
              </Table>
            </Wrapper>
          )}
          <Wrapper alignItems='start' title='Your Bots'>
            <Container justifyContent='start' flexDirection='row'>
              <AddBotCard addCard={addCard} />
              {botCards}
            </Container>
          </Wrapper>
        </Container>
      </Main>
    </>
  )
}
