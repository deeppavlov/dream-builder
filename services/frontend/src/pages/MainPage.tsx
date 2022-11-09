import { AddBotCard } from '../components/AddBotCard/AddBotCard'
import { BotCard } from '../components/BotCard/BotCard'
import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const MainPage = () => {
  return (
    <>
      <Topbar type='main' />
      <Main sidebar='none'>
        <Container flexDirection='column'>
          <Wrapper
            alignItems='start'
            title='Public Bots'
            amount='5'
            linkTo='/bots'>
            <Container justifyContent='space-around' flexDirection='row'>
              <BotCard />
              <BotCard />
              <BotCard />
              <BotCard />
            </Container>
          </Wrapper>
          <Wrapper alignItems='start' title='Your Bots'>
            <Container justifyContent='space-around' flexDirection='row'>
              <AddBotCard />
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
