import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from 'api/user'
import { Loader } from 'components/Loaders'
import { Container, Main, Wrapper } from 'components/UI'

/**
 * Parsing `auth_code` that comes from Google
 */
export const GoogleAuthPage = () => {
  const navigate = useNavigate()
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    if (!code) {
      navigate('/')
      return
    }

    exchangeAuthCode(code).then(url => {
      const navURL = url.split('/').slice(3).join('/')
      setUrl(`/${navURL}`)
    })
  }, [])

  useEffect(() => {
    if (url) navigate(url)
  }, [url])
  return (
    <Main sidebar>
      <Wrapper fullHeight>
        <Container forLoader>
          <Loader width='128' />
        </Container>
      </Wrapper>
    </Main>
  )
}
