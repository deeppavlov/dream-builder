import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Container } from '../ui/Container/Container'
import { Annotators } from '../components/Annotators/Annotators'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { BotTab } from '../components/Sidebar/components/BotTab'
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'

export const EditorPage = () => {
  return (
    <>
      <Topbar type='editor' />
      <Tabs>
        <Sidebar type='editor'>
          <TabList>
            <Tab>
              <BotTab />
            </Tab>
            <Tab>
              <SkillsTab />
            </Tab>
          </TabList>
        </Sidebar>
        <Main flexDirection='row' gap='0px'>
          <TabPanel>
            <Container height='100%'>
              <Annotators />
              <Annotators />
              <SkillSelector />
              <Skills />
              <CandidateAnnotators />
            </Container>
          </TabPanel>
          <TabPanel>
            <Wrapper flexDirection='row'>
              <Container
                justifyContent='start'
                flexWrap='wrap'
                flexDirection='row'>
                <SkillInBotCard />
                <SkillInBotCard />
                <SkillInBotCard />
                <SkillInBotCard />
                <SkillInBotCard />
              </Container>
            </Wrapper>
          </TabPanel>
        </Main>
      </Tabs>
    </>
  )
}
