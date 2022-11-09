import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Container } from '../components/Container/Container'
import { Annotators } from '../components/Annotators/Annotators'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'

export const EditorPage = () => {
  return (
    <>
      <Topbar type='editor' />
      <Sidebar type='editor' />
      <Main>
        <Container height='100%'>
          <Annotators />
          <SkillSelector />
          <Skills />
          <CandidateAnnotators />
        </Container>
      </Main>
    </>
  )
}
