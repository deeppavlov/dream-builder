import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { useAuth } from '../context/AuthProvider'
import { getComponentsFromAssistantDists } from '../services/getComponentsFromAssistantDists'
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
import { useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import IntentCatcherModal from '../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderModal from '../components/IntentResponderModal/IntentResponderModal'
import { dateToUTC } from '../utils/dateToUTC'
import { Annotators } from '../components/Annotators/Annotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { useEffect, useState } from 'react'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../ui/Table/Table'
import { AddButton } from '../ui/AddButton/AddButton'
import Hint from '../components/Hint/Hint'
import SkillPromptModal from '../components/SkillPromptModal/SkillPromptModal'
import BaseSidePanel from '../components/BaseSidePanel/BaseSidePanel'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { usePreview } from '../context/PreviewProvider'
import { SignInModal } from '../components/SignInModal/SignInModal'

export const EditorPage = () => {
  const [listView, setListView] = useState<boolean>(false)
  const auth = useAuth()
  const { state } = useLocation()
  const { distName, displayName } = state
  const { setIsPreview } = usePreview()

  useEffect(() => {
    setIsPreview(state?.preview)
  }, [state])
  //вынести в отдельный хук обновление режима превью на основе стэйта роутера?

  const {
    isLoading: isDistsComponentsLoading,
    error: distsComponentsError,
    data: distsComponentsData,
  } = useQuery(
    ['distsComponents', distName],
    () => getComponentsFromAssistantDists(distName!),
    {
      enabled: distName?.length! > 0,
    }
  )

  const annotators = distsComponentsData?.annotators
  const candidateAnnotators = distsComponentsData?.candidate_annotators
  const skills = distsComponentsData?.skills
  const skillSelectors = distsComponentsData?.skill_selectors
  const responseSelectors = distsComponentsData?.response_selectors
  const responseAnnotators = distsComponentsData?.response_annotators

  const viewHandler = () => {
    setListView(listView => !listView)
  }
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
            tab='Skills'
            title={displayName}
            name={distName}
          />
          <Main sidebar editor>
            {!listView ? (
              <Wrapper skills>
                <Container
                  display='grid'
                  gridTemplateColumns='repeat(auto-fill, minmax(280px, 1fr))'
                  height='auto'>
                  {isDistsComponentsLoading && 'Loading...'}
                  {/* <AddButton /> */}
                  {skills?.map((skill: any, i: number) => {
                    const dateCreated = dateToUTC(skill?.date_created)
                    return (
                      <SkillCard
                        key={i}
                        type='your'
                        big
                        author={skill?.author}
                        authorImg={DeepPavlovLogo}
                        name={skill?.display_name}
                        dateCreated={dateCreated}
                        desc={skill?.description}
                        version={skill?.version}
                        ram={skill?.ram_usage}
                        gpu={skill?.gpu_usage}
                        executionTime={skill?.execution_time}
                        skillType={skill?.component_type}
                        botName={skill?.botName}
                      />
                    )
                  })}
                </Container>
              </Wrapper>
            ) : (
              <Wrapper fullHeight>
                <Container>
                  {isDistsComponentsLoading && 'Loading...'}
                  <Table
                    addButton={
                      <AddButton
                        listView={listView}
                        disabled={auth?.user === null}
                      />
                    }>
                    {skills?.map((skill: any, i: number) => {
                      const dateCreated = dateToUTC(skill?.date_created)
                      return (
                        <SkillListItem
                          key={i}
                          author={auth?.user?.name!}
                          authorImg={auth?.user?.picture!}
                          name={skill?.display_name}
                          dateCreated={dateCreated}
                          desc={skill?.description}
                          version={skill?.version}
                          ram={skill?.ram_usage}
                          gpu={skill?.gpu_usage}
                          executionTime={skill?.execution_time}
                          skillType={skill?.component_type}
                          botName={skill?.author}
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
            tab='Architecture'
            type='editor'
            viewHandler={viewHandler}
            title={displayName}
          />
          <Main sidebar editor draggable>
            {isDistsComponentsLoading && 'Loading...'}
            <Annotators annotators={annotators} />
            <SkillSelector skillSelectors={skillSelectors} />
            <Skills skills={skills} />
            <CandidateAnnotators candidateAnnotators={candidateAnnotators} />
            <ResponseSelector responseSelectors={responseSelectors} />
            <ResponseAnnotators responseAnnotators={responseAnnotators} />
          </Main>
        </TabPanel>
      </Tabs>

      {/* Modals */}
      <BaseSidePanel position={{ top: 64 }} />
      <AssistantModal />
      <IntentCatcherModal />
      <IntentResponderModal />
      <SkillPromptModal />
      <SignInModal />
    </>
  )
}
