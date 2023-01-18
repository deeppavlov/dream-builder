import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { getSkillListByDistName } from '../services/getSkillListByDistName'
import { useAuth } from '../services/AuthProvider'
import { getComponentsFromAssistantDists } from '../services/getComponentsFromAssistantDists'
import { capitalizeTitle } from '../utils/capitalizeTitle'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Container } from '../ui/Container/Container'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { BotTab } from '../components/Sidebar/components/BotTab'
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { ResponseSelector } from '../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../components/ResponseAnnotators/ResponseAnnotators'
import { SkillCard } from '../components/SkillCard/SkillCard'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDistByName } from '../services/getDistByName'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import IntentCatcherSidePanel from '../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import IntentCatcherModal from '../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderModal from '../components/IntentResponderModal/IntentResponderModal'
import IntentResponderSidePanel from '../components/IntentResponderSidePanel/IntentResponderSidePanel'
import { dateToUTC } from '../utils/dateToUTC'
import { Annotators } from '../components/Annotators/Annotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'

export const EditorPage = () => {
  const auth = useAuth()
  const data = useParams()

    const {
      isLoading: isDistsComponentsLoading,
      error: distsComponentsError,
      data: distsComponentsData,
    } = useQuery(
      ['distsComponents', data.name],
      () => getComponentsFromAssistantDists(data.name!),
      {
        enabled: data.name?.length! > 0,
      }
    )
  
  const {
    isLoading: isSkillListLoading,
    error: skillListError,
    data: skillListData,
  } = useQuery(
    ['skillList', data.name],
    () => getSkillListByDistName(data.name!),
    {
      enabled: data.name?.length! > 0,
    }
  )

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
      <Topbar type='editor' title={capitalizeTitle(data?.name!)} />
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
            {isDistLoading ? (
              <>{'Loading...'}</>
            ) : (
              <>
                <Annotators annotatorsList={annotators} />
                <SkillSelector skillSelectorsList={skillSelectors} />
                <Skills skillsList={skills} />
                {/* <CandidateAnnotators /> */}
                <ResponseSelector responseSelectorsList={responseSelectors} />
                <ResponseAnnotators
                  responseAnnotatorsList={responseAnnotators}
                />
              </>
            )}
          </Main>
        </TabPanel>
        <TabPanel>
          <Main sidebar editor>
            <Wrapper>
              <Container
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(280px, 1fr))'>
                {skillListData?.map((skill: any) => {
                  const dateCreated = dateToUTC(skill.metadata.date_created)
                  return (
                    <SkillCard
                      type='your'
                      name={skill.metadata.display_name}
                      author={auth?.user?.name!}
                      dateCreated={dateCreated}
                      desc={skill.metadata.description}
                      version={skill.metadata.version}
                      ram={skill.metadata.ram_usage}
                      gpu={skill.metadata.gpu_usage}
                      executionTime={skill.metadata.execution_time}
                      skillType={skill.metadata.type}
                    />
                  )
                })}
              </Container>
            </Wrapper>
          </Main>
        </TabPanel>
      </Tabs>
      <SkillSidePanel position={{ top: 64 }} />
      <IntentCatcherSidePanel position={{ top: 64 }} />
      <IntentResponderSidePanel position={{ top: 64 }} />
      <IntentCatcherModal />
      <IntentResponderModal />
    </>
  )
}
