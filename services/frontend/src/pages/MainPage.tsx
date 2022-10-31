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
      <Sidebar />
      <Main
        title='Bots'
        firstLine=' List of all the owned or assigned to you.'
        secondLine='Select a bot to view or edit in the Bot Builder'>
        <Container flexDirection='column'>
          <Wrapper
            alignItems='start'
            title='Public Bots'
            amount='5'
            linkTo='/bots'>
            <Container flexDirection='row'>
              <BotCard />
              <BotCard />
              <BotCard />
              <BotCard />
            </Container>
          </Wrapper>
          <Wrapper alignItems='start' title='Your Bots'>
            <Container flexDirection='row'>
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
