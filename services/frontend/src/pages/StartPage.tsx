import { Topbar } from '../components/Topbar/Topbar'
import { Main } from '../components/Main/Main'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Container } from '../ui/Container/Container'
import { Card } from '../components/Card/Card'
import { Banner } from '../components/Banner/Banner'
import { useAuth } from '../Router/AuthProvider'
import { RoutesList } from '../Router/RoutesList'

export const StartPage = () => {
  const auth = useAuth()
  const user = auth?.user

  return (
    <>
      <Topbar />
      <Main>
        {user && <Banner name={user.name} />}
        <Wrapper>
          <Container>
            <Card
              title='Virtual Assistants'
              img='VA'
              link={RoutesList.bots}
              btnTitle='Go to Virtual Assistants'
              text='Start your journey with constructing your virtual assistant or chatbot from scratch or clone one of the virtual assistants and chatbots published in Dream Builder.'
            />
            <Card
              title='Skills'
              text='If you are interested in designing scenario-driven or generative skills you can go to start by checking our skills’ public library or design your own skill from scratch.'
              img='Skills'
              link={RoutesList.skills}
              btnTitle='Go to Skills'
              buttonColor='purple'
            />
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
