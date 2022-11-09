import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const SignInPage = () => {
  return (
    <>
      <Topbar />
      <Main sidebar='none'>
        <Wrapper>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '20px',
            }}>
            <h4>Sign In</h4>
            <input type='text' placeholder='Email Address' />
            <input type='text' placeholder='Password' />
            <button
              style={{
                width: '100px',
                padding: '10px',
                color: 'white',
                backgroundColor: '#3300ff',
                borderRadius: '10px',
              }}>
              Sign Up
            </button>
          </form>
        </Wrapper>
      </Main>
    </>
  )
}
