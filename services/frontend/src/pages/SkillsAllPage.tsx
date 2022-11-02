import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const SkillsAllPage = () => {
  return (
    <>
      <Topbar type='main' />
      <Sidebar />
      <Main
        title='Public Skills'
        firstLine='Here are research of out team and creation of basic skills with different configurations.'
        secondLine='You can choose one of them as the basis for your skill.'>
        <Container flexDirection='column'>
          <Wrapper alignItems='start'>
            <Container flexWrap='wrap' flexDirection='row'>
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
            </Container>
          </Wrapper>
        </Container>
      </Main>
    </>
  )
}
