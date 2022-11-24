import { useState } from 'react'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'

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
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
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
