import { BotCard } from '../components/BotCard/BotCard'
import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const BotsPage = () => {
  return (
    <>
      <Topbar type='main' />
      <Sidebar />
      <Main
        title='Public Bots'
        firstLine='Here are research of out team and creation of basic bots with different configurations.'
        secondLine='You can choose one of them as the basis for your bot.'>
        <Container flexDirection='column'>
          <Wrapper alignItems='start'>
            <Container flexWrap='wrap' flexDirection='row'>
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
        </Container>
      </Main>
    </>
  )
}
