import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Stack } from '../components/Stack/Stack'
import { Topbar } from '../components/Topbar/Topbar'

export const EditorPage = () => {
  return (
    <>
      <Topbar />
      <Main>
        <Container>
          <Stack />
          <Stack />
        </Container>
      </Main>
    </>
  )
}
