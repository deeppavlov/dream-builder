import { useState } from 'react'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Container } from '../components/Container/Container'
import { Table } from '../components/Table/Table'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const BotsPage = () => {
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    console.log(listView)
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <Wrapper alignItems='start'>
            <Container
              justifyContent='start'
              flexWrap='wrap'
              flexDirection='row'>
              <BotCard />
              <BotCard />
              <BotCard />
              <BotCard />
              <BotCard />
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
              <BotListItem />
              <BotListItem />
              <BotListItem />
              <BotListItem />
              <BotListItem />
            </Table>
          </Wrapper>
        )}
      </Main>
    </>
  )
}
