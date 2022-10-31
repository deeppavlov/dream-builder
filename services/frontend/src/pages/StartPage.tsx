import { Main } from '../components/Main/Main'
import { Wrapper } from '../components/Wrapper/Wrapper'
import { Banner } from '../components/Banner/Banner'
import { Card } from '../components/Card/Card'
import { Container } from '../components/Container/Container'
import { Topbar } from '../components/Topbar/Topbar'

export const StartPage = () => {
  return (
    <>
      <Topbar type='/' />
      <Main sidebar='none'>
        <Wrapper>
          <Banner />
          <Container>
            <Card img={'Robot'} link={'main'} title={'Go to Bots'} />
            <Card
              img={'Heart'}
              link={'skills'}
              title={'Go to Skills'}
              button={'#7000ff'}
            />
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
