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
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { ResponseSelector } from '../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../components/ResponseAnnotators/ResponseAnnotators'
import { TestTabWindow } from '../components/TestTabWindow/TestTabWindow'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDistByName } from '../services/getDistByName'

export const EditorPage = () => {
  const [skillsList, setSkillsList] = useState([])
  const [listView, setListView] = useState<boolean>(false)
  const viewHandler = () => {
    setListView(!listView)
    setSkillsList([])
  }
  const addSkill = () => {
    !listView
      ? setSkillsList(skillsList.concat(<SkillInBotCard maxWidth='345px' />))
      : setSkillsList(skillsList.concat(<SkillListItem />))
  }
  const data = useParams()
  const {
    isLoading: isDistLoading,
    error: distError,
    data: distData,
  } = useQuery(['dist', data.name], () => getDistByName(data.name!), {
    enabled: data.name?.length! > 0,
  })
  
  if (distError) return <>An error has occurred: + {distError}</>

  const annotators =
    distData?.pipeline_conf?.services?.annotators &&
    Object.keys(distData?.pipeline_conf?.services?.annotators).map(i => i)
  const skills =
    distData?.pipeline_conf?.services?.skills &&
    Object.keys(distData?.pipeline_conf?.services?.skills).map(i => i)
  const skillSelectors =
    distData?.pipeline_conf?.services?.skill_selectors &&
    Object.keys(distData?.pipeline_conf?.services?.skill_selectors).map(i => i)
  const responseSelectors =
    distData?.pipeline_conf?.services?.response_selectors &&
    Object.keys(distData?.pipeline_conf?.services?.response_selectors).map(
      i => i
    )
  const responseAnnotators =
    distData?.pipeline_conf?.services?.response_annotators &&
    Object.keys(distData?.pipeline_conf?.services?.response_annotators).map(
      i => i
    )
  
  return (
    <>
      <Topbar type='editor' title={data.name} />
      <Tabs>
        <Sidebar>
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
            </Container>
          </TabList>
        </Sidebar>
        <TabPanel>
          <Main sidebar editor draggable>
            <Annotators annotatorsList={annotators} />
            <SkillSelector skillSelectorsList={skillSelectors} />
            <Skills skillsList={skills} />
            {/* <CandidateAnnotators /> */}
            <ResponseSelector responseSelectorsList={responseSelectors} />
            <ResponseAnnotators responseAnnotatorsList={responseAnnotators} />
          </Main>
        </TabPanel>
        <TabPanel>
          <Main sidebar editor>
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
                {skills &&
                  skills.map((skill: string) => {
                    return (
                      <SkillInBotCard
                        name={skill}
                        author={''}
                        dateCreated={''}
                        desc={''}
                        version={''}
                        ram={''}
                        gpu={''}
                        skillType={'script'}
                      />
                    )
                  })}
              </Container>
            </Wrapper>
          </Main>
        </TabPanel>
      </Tabs>
    </>
  )
}
