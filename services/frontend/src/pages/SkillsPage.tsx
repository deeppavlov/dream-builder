import { AddBotCard } from '../components/AddBotCard/AddBotCard'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

export const SkillsPage = () => {
  return (
    <>
      <Topbar type='main' />
      <Main
        title='Skills'
        firstLine=' List of all the owned or assigned to you.'
        secondLine='Select a skill to view or edit in the Skill Builder'>
        <Container flexDirection='column'>
          <Wrapper
            alignItems='start'
            title='Public Skills'
            amount='5'
            linkTo='/allskills'>
            <Container flexDirection='row'>
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
            </Container>
          </Wrapper>
          <Wrapper alignItems='start' title='Your Skills'>
            <Container flexDirection='row'>
              <AddBotCard />
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
