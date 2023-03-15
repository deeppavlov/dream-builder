import { useEffect, useState } from 'react'
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../Context/AuthProvider'
import { getComponents } from '../services/getComponents'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { AddButton } from '../ui/AddButton/AddButton'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { BotTab } from '../components/Sidebar/components/BotTab'
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { ResponseSelector } from '../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../components/ResponseAnnotators/ResponseAnnotators'
import { SkillCard } from '../components/SkillCard/SkillCard'
import IntentCatcherModal from '../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderModal from '../components/IntentResponderModal/IntentResponderModal'
import { Annotators } from '../components/Annotators/Annotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import SkillPromptModal from '../components/SkillPromptModal/SkillPromptModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { usePreview } from '../Context/PreviewProvider'
import { SignInModal } from '../components/SignInModal/SignInModal'
import BaseToolTip from '../components/BaseToolTip/BaseToolTip'
import { Loader } from '../components/Loader/Loader'
import { ErrorHandler } from '../components/ErrorHandler/ErrorHandler'
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
  const viewHandler = () => {
    setListView(listView => !listView)
  }

  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(
    ['components', state?.distName],
    () => getComponents(state?.distName! || nameFromURL),
    {
      enabled: state?.distName?.length! > 0 || nameFromURL.length > 0,
    }
  )

  const annotators = components?.annotators
  const candidateAnnotators = components?.candidate_annotators
  const skills = components?.skills
  const skillSelectors = components?.skill_selectors
  const responseSelectors = components?.response_selectors
  const responseAnnotators = components?.response_annotators

  const skillCardsList = skills?.map((skill: ISkill, i: number) => {
    return <SkillCard key={i} type='your' big skill={skill} />
  })

  const skillTablesList = skills?.map((skill: ISkill, i: number) => {
    return <SkillListItem key={i} skill={skill} />
  })

  return (
    <>
      <Tabs>
        <Sidebar>
          <TabList>
            <Container layoutForTabs>
              <BaseToolTip
                id='sidebarSkillTab'
                content='Skills'
                place='right'
              />
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
            <Wrapper skills>
              <Loader isLoading={isComponentsLoading} />
              <ErrorHandler error={componentsError} />
              {!listView ? (
                <Container gridForCards heightAuto>
                  {/* <AddButton /> */}
                  {skillCardsList}
                </Container>
              ) : (
                <Table
                  second='Type'
                  addButton={
                    <AddButton
                      listView={listView}
                      disabled={!auth?.user}
                      text='Create From Scratch'
                    />
                  }>
                  {skillTablesList}
                </Table>
              )}
            </Wrapper>
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
            <Loader isLoading={isComponentsLoading} />
            <Annotators annotators={annotators} />
            <SkillSelector skillSelectors={skillSelectors} />
            <Skills skills={skills} />
            <CandidateAnnotators candidateAnnotators={candidateAnnotators} />
            <ResponseSelector responseSelectors={responseSelectors} />
            <ResponseAnnotators responseAnnotators={responseAnnotators} />
          </Main>
        </TabPanel>
      </Tabs>

      <BaseSidePanel />
      <AssistantModal />
      <IntentCatcherModal />
      <IntentResponderModal />
      <SkillPromptModal />
      <SignInModal />
    </>
  )
}
