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
import { TestTab } from '../components/Sidebar/components/TestTab'
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { ResponseSelector } from '../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../components/ResponseAnnotators/ResponseAnnotators'
import { TestTabWindow } from '../components/TestTabWindow/TestTabWindow'
import { SkillCard } from '../components/SkillCard/SkillCard'
import { dateToUTC } from '../utils/dateToUTC'
import { nanoid } from 'nanoid'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'

export const EditorPage = () => {
  const [skills, setSkills] = useState<JSX.Element[]>([])
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    setSkills([])
    console.log(listView)
  }
  const addSkill = () => {
    !listView
      ? setSkills(
          skills.concat([
            <SkillCard
              key={nanoid(8)}
              type='your'
              name='Name of The Skill'
              skillType='fallbacks'
              botName='Name of The Bot'
              desc='Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo'
              dateCreated={dateToUTC(new Date())}
              version='0.01'
              ram='0.0 GB'
              gpu='0.0 GB'
              executionTime='0.0 ms'
              big
            />,
          ])
        )
      : setSkills(skills.concat(<SkillListItem />))
  }
  return (
    <>
      <Topbar type='editor' />
      <Tabs>
        <Sidebar type='editor'>
          <TabList>
            <Container
              width='100%'
              alignItems='center'
              flexDirection='column'
              gap='12px'
              overflow='hidden'>
              <Tab>
                <BotTab />
              </Tab>
              <Tab>
                <SkillsTab />
              </Tab>
              <Tab>
                <TestTab />
              </Tab>
            </Container>
          </TabList>
        </Sidebar>
        <TabPanel>
          <Main flexDirection='row'>
            <Annotators />
            <SkillSelector />
            <Skills />
            <CandidateAnnotators />
            <ResponseSelector />
            <ResponseAnnotators />
          </Main>
        </TabPanel>
        <TabPanel>
          <Main>
            <Wrapper>
              <Container
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(280px, 1fr))'>
                <AddButton
                  listView={listView}
                  addBot={addSkill}
                  maxWidth='345px'
                  height='330px'
                />
                <SkillCard
                  type='your'
                  name='Name of The Skill'
                  skillType='fallbacks'
                  botName='Name of The Bot'
                  desc='Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo'
                  dateCreated={dateToUTC(new Date())}
                  version='0.01'
                  ram='0.0 GB'
                  gpu='0.0 GB'
                  executionTime='0.0 ms'
                  big
                />
                {skills}
              </Container>
            </Wrapper>
          </Main>
        </TabPanel>
        <TabPanel>
          <Main justifyContent='center'>
            <TestTabWindow />
          </Main>
        </TabPanel>
      </Tabs>
      <SkillSidePanel position={{ top: 64 }} />
    </>
  )
}
