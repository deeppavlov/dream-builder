import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const SignUpPage = () => {
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
              gap: '24px',
            }}>
            <h4>Sign Up</h4>
            <input type='text' placeholder='First name' />
            <input type='text' placeholder='Last name' />
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
