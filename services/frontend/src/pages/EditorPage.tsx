import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { useAuth } from '../Context/AuthProvider'
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
import { Annotators } from '../components/Annotators/Annotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { useEffect, useState } from 'react'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../ui/Table/Table'
import { AddButton } from '../ui/AddButton/AddButton'
import SkillPromptModal from '../components/SkillPromptModal/SkillPromptModal'
import BaseSidePanel from '../components/BaseSidePanel/BaseSidePanel'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { usePreview } from '../Context/PreviewProvider'
import { SignInModal } from '../components/SignInModal/SignInModal'
import BaseToolTip from '../components/BaseToolTip/BaseToolTip'
import { ISkill } from '../types/types'

export const EditorPage = () => {
  const [listView, setListView] = useState<boolean>(false)
  const auth = useAuth()
  const { state } = useLocation()
  const location = useLocation()
  const nameFromURL = location?.pathname?.substring(1)

  const makeDisplayName = (name: string) => {
    const splitted = name.split('_')
    splitted.length = splitted.length - 2
    return splitted
      .map((word: string) => {
        return word[0].toUpperCase() + word.slice(1)
      })
      .join(' ')
  }
  const displayName = makeDisplayName(nameFromURL)

  const { setIsPreview } = usePreview()

  useEffect(() => {
    setIsPreview(state?.preview == undefined ? true : state?.preview)
  }, [state])
  //вынести в отдельный хук обновление режима превью на основе стэйта роутера?

  const {
    isLoading: isDistsComponentsLoading,
    error: distsComponentsError,
    data: distsComponentsData,
  } = useQuery(
    ['distsComponents', state?.distName],
    () => getComponentsFromAssistantDists(state?.distName! || nameFromURL),
    {
      enabled: state?.distName?.length! > 0 || nameFromURL.length > 0,
    }
  )

  const annotators = distsComponentsData?.annotators
  const candidateAnnotators = distsComponentsData?.candidate_annotators
  const skills: ISkill[] = distsComponentsData?.skills
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
              overflow='visible'>
              {/* If Tooltip put in Tab, then they will be glitching */}
              <BaseToolTip
                id='sidebarSkillTab'
                content='Skills'
                place='right'
              />
              {/* {localStorage.getItem('isVisited') && (
              )} */}
              <Tab>
                <SkillsTab />
              </Tab>
              <Tab>
                <BotTab />
              </Tab>
            </Container>
          </TabList>
        </Sidebar>
        <TabPanel>
          <Topbar
            viewChanger
            type='editor'
            viewHandler={viewHandler}
            tab='Skills'
            title={state?.displayName || displayName}
            name={state?.distName || nameFromURL}
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
                  {skills?.map((skill, i) => (
                    <SkillCard key={i} type='your' big skill={skill} />
                  ))}
                </Container>
              </Wrapper>
            ) : (
              <Wrapper fullHeight>
                <Container>
                  {isDistsComponentsLoading && 'Loading...'}
                  <Table
                    second='Type'
                    addButton={
                      <AddButton
                        listView={listView}
                        addBot={() => {}}
                        disabled={!auth?.user}
                        text='Create From Scratch'
                      />
                    }>
                    {skills?.map((skill, i) => (
                      <SkillListItem key={i} skill={skill} />
                    ))}
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
            title={state?.displayName || displayName}
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
