import { useState } from 'react'
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Container } from '../ui/Container/Container'
import { AddButton } from '../ui/AddButton/AddButton'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Annotators } from '../components/Annotators/Annotators'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { BotTab } from '../components/Sidebar/components/BotTab'
import { AnotherTab } from '../components/Sidebar/components/AnotherTab'
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'

export const EditorPage = () => {
  const [skills, setSkills] = useState([])
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    setSkills([])
    console.log(listView)
  }
  const addSkill = () => {
    !listView
      ? setSkills(skills.concat(<SkillInBotCard maxWidth='345px' />))
      : setSkills(skills.concat(<SkillListItem />))
  }

  return (
    <>
      <Topbar type='editor' />
      <Tabs>
        <Sidebar type='editor'>
          <TabList >
            <Container
              width='100%'
              alignItems='center'
              flexDirection='column'
              gap='12px'>
              <Tab>
                <BotTab />
              </Tab>
              <Tab>
                <SkillsTab />
              </Tab>
              <Tab>
                <AnotherTab />
              </Tab>
            </Container>
          </TabList>
        </Sidebar>
        <TabPanel>
          <Main flexDirection='row'>
            <Annotators />
            <Annotators />
            <SkillSelector />
            <Skills />
            <CandidateAnnotators />
          </Main>
        </TabPanel>
        <TabPanel>
          <Main>
            <Wrapper>
              <Container
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
                <AddButton
                  listView={listView}
                  addBot={addSkill}
                  maxWidth='345px'
                  height='330px'
                />
                <SkillInBotCard maxWidth='345px' />
                <SkillInBotCard maxWidth='345px' />
                <SkillInBotCard maxWidth='345px' />
                <SkillInBotCard maxWidth='345px' />
                <SkillInBotCard maxWidth='345px' />
                {skills}
              </Container>
            </Wrapper>
          </Main>
        </TabPanel>
        <TabPanel>
          <Main>
            <Wrapper>
              <Container
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
                New Tab
              </Container>
            </Wrapper>
          </Main>
        </TabPanel>
      </Tabs>
    </>
  )
}
