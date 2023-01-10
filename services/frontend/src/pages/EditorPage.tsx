import { useId, useState } from 'react'
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
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { ResponseSelector } from '../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../components/ResponseAnnotators/ResponseAnnotators'
import { SkillCard } from '../components/SkillCard/SkillCard'
import { dateToUTC } from '../utils/dateToUTC'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDistByName } from '../services/getDistByName'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import { timeToUTC } from '../utils/timeToUTC'
import { useAuth } from '../services/AuthProvider'

export const EditorPage = () => {
  const auth = useAuth()
  const [skillsList, setSkillsList] = useState<JSX.Element[]>([])
  const [listView, setListView] = useState<boolean>(false)

  const viewHandler = () => {
    setListView(!listView)
    setSkillsList([])
  }

  const addSkill = () => {
    !listView
      ? setSkillsList(
          skills.concat([
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
            />,
          ])
        )
      : setSkillsList(
          skills.concat([
            <SkillListItem
              key={useId()}
              name='Name of The Skill'
              desc='Helps users locate the nearest store. And we can write 3 lines
        here and this is maximum about'
              botName={'Name of The Bot'}
              skillType='retrieval'
              version='0.01'
              dateCreated={dateToUTC(new Date())}
              time={timeToUTC(new Date().getTime())}
              ram='0.0 GB'
              gpu='0.0 GB'
              executionTime='0.0 ms'
              disabledMsg={
                auth?.user
                  ? undefined
                  : 'You must be signed in to add the skill'
              }
            />,
          ])
        )
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
      </Tabs>
      <SkillSidePanel position={{ top: 64 }} />
    </>
  )
}
