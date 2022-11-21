import { Main } from '../components/Main/Main'
import { Wrapper } from '../components/Wrapper/Wrapper'
import { Card } from '../components/Card/Card'
import { Container } from '../components/Container/Container'
import { Topbar } from '../components/Topbar/Topbar'
export const StartPage = () => {
  return (
    <>
      <Topbar />
      <Main sidebar='none'>
        <Wrapper alignItems='start' closable={true}>
          <h5>
            Irina, welcome to
            <span className='accent_text'> Dream Builder</span> Console!
          </h5>
          <ul className='li'>
            You can now build and manage your own virtual assistants & chatbots!
            <li className='li'> Construct it as a lego.</li>
            <li className='li'>
              No more coding, compose it visually on your board
            </li>
            <li className='li'>
              Control, manage, chat with your virtual assistant in a single
              place.
            </li>
          </ul>
        </Wrapper>
        <Wrapper>
          <Container>
            <Card
              title='Virtual Assistants'
              img={'GoToVA'}
              link={'/main'}
              btnTitle={'Go to Virtual Assistants'}
              text={
                'Start your journey with constructing your virtual assistant or chatbot from scratch or clone one of the virtual assistants and chatbots published in Dream Builder.'
              }
            />
            <Card
              title={'Skills'}
              text={
                'If you are interested in designing scenario-driven or generative skills you can go to start by checking our skills’ public library or design your own skill from scratch.'
              }
              img={'GoToS'}
              link={'/skills'}
              btnTitle={'Go to Skills'}
              button={'#7000ff'}
            />
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
