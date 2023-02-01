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
import { useState } from 'react'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../ui/Table/Table'
import { AddButton } from '../ui/AddButton/AddButton'
import Hint from '../components/Hint/Hint'
import { BotCard } from '../components/BotCard/BotCard'
import AnnotatorSidePanel from '../components/AnnotatorSidePanel/AnnotatorSidePanel'
import SkillPromptModal from '../components/SkillPromptModal/SkillPromptModal'
import BaseSidePanel from '../components/BaseSidePanel/BaseSidePanel'

export const EditorPage = () => {
  const [listView, setListView] = useState<boolean>(false)
  const viewHandler = () => {
    setListView(listView => !listView)
  }
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

  const annotators = distsComponentsData?.annotators
  const candidateAnnotators = distsComponentsData?.candidate_annotators
  const skills = distsComponentsData?.skills
  const skillSelectors = distsComponentsData?.skill_selectors
  const responseSelectors = distsComponentsData?.response_selectors
  const responseAnnotators = distsComponentsData?.response_annotators

  return (
    <>
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
                <SkillsTab />
              </Tab>
              <Tab>
                <BotTab />
              </Tab>
            </Container>
          </TabList>
          <Hint />
        </Sidebar>
        <TabPanel>
          <Topbar
            viewChanger
            type='editor'
            viewHandler={viewHandler}
            preview
            title={capitalizeTitle(data?.name!)}
          />
          <Main sidebar editor>
            {!listView ? (
              <Wrapper>
                <Container
                  display='grid'
                  gridTemplateColumns='repeat(auto-fill, minmax(280px, 1fr))'
                  height='auto'>
                  {/* <AddButton /> */}
                  {skillListData?.map((skill: any, i: number) => {
                    const dateCreated = dateToUTC(skill.metadata.date_created)
                    return (
                      <SkillCard
                        key={i}
                        type='your'
                        big
                        author={auth?.user?.name!}
                        authorImg={auth?.user?.picture!}
                        name={skill.metadata.display_name}
                        dateCreated={dateCreated}
                        desc={skill.metadata.description}
                        version={skill.metadata.version}
                        ram={skill.metadata.ram_usage}
                        gpu={skill.metadata.gpu_usage}
                        executionTime={skill.metadata.execution_time}
                        skillType={skill.metadata.type}
                        botName={skill.metadata.author}
                      />
                    )
                  })}
                </Container>
              </Wrapper>
            ) : (
              <Wrapper fullHeight>
                <Container>
                  <Table
                    addButton={
                      <AddButton
                        listView={listView}
                        disabled={auth?.user === null}
                      />
                    }>
                    {skillListData?.map((skill: any, i: number) => {
                      const dateCreated = dateToUTC(skill.metadata.date_created)
                      return (
                        <SkillListItem
                        key={i}
                        author={auth?.user?.name!}
                        authorImg={auth?.user?.picture!}
                          name={skill.metadata.display_name}
                          dateCreated={dateCreated}
                          desc={skill.metadata.description}
                          version={skill.metadata.version}
                          ram={skill.metadata.ram_usage}
                          gpu={skill.metadata.gpu_usage}
                          executionTime={skill.metadata.execution_time}
                          skillType={skill.metadata.type}
                          botName={skill.metadata.author}
                        />
                      )
                    })}
                  </Table>
                </Container>
              </Wrapper>
            )}
          </Main>
        </TabPanel>
        <TabPanel>
          <Topbar
            type='editor'
            viewHandler={viewHandler}
            preview
            title={capitalizeTitle(data?.name!)}
          />
          <Main sidebar editor draggable>
            {isDistLoading ? (
              <>{'Loading...'}</>
            ) : (
              <>
                <Annotators annotators={annotators} />
                <SkillSelector skillSelectors={skillSelectors} />
                <Skills skills={skills} />
                <CandidateAnnotators
                  candidateAnnotators={candidateAnnotators}
                />
                <ResponseSelector responseSelectors={responseSelectors} />
                <ResponseAnnotators responseAnnotators={responseAnnotators} />
              </>
            )}
          </Main>
        </TabPanel>
      </Tabs>

      {/* Sidepanels */}
      <BaseSidePanel position={{ top: 64 }} />
      {/* <SkillSidePanel position={{ top: 64 }} />
      <IntentCatcherSidePanel position={{ top: 64 }} />
      <IntentResponderSidePanel position={{ top: 64 }} />
      <AnnotatorSidePanel position={{ top: 64 }} /> */}

      {/* Modals */}
      <IntentCatcherModal />
      <IntentResponderModal />
      <SkillPromptModal />
    </>
  )
}
