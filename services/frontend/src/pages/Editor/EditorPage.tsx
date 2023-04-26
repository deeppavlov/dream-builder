import { useEffect, useState } from 'react'
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import {
  Outlet,
  generatePath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../../context/AuthProvider'
import { getComponents } from '../../services/getComponents'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { Container } from '../../ui/Container/Container'
import { Table } from '../../ui/Table/Table'
import { AddButton } from '../../ui/AddButton/AddButton'
import { Main } from '../../components/Main/Main'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { BotTab } from '../../components/Sidebar/components/BotTab'
import { SkillsTab } from '../../components/Sidebar/components/SkillsTab'
import { ResponseSelector } from '../../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../../components/ResponseAnnotators/ResponseAnnotators'
import IntentCatcherModal from '../../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderModal from '../../components/IntentResponderModal/IntentResponderModal'
import { Annotators } from '../../components/Annotators/Annotators'
import { SkillSelector } from '../../components/SkillSelector/SkillSelector'
import { Skills } from '../../components/Skills/Skills'
import { CandidateAnnotators } from '../../components/CandidateAnnotators/CandidateAnnotators'
import SkillPromptModal from '../../components/SkillPromptModal/SkillPromptModal'
import { BaseSidePanel } from '../../components/BaseSidePanel/BaseSidePanel'
import { AssistantModal } from '../../components/AssistantModal/AssistantModal'
import { usePreview } from '../../context/PreviewProvider'
import { SignInModal } from '../../components/SignInModal/SignInModal'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import { Loader } from '../../components/Loader/Loader'
import { ErrorHandler } from '../../components/ErrorHandler/ErrorHandler'
import { SkillList } from '../../components/SkillList/SkillList'
import { Toaster } from 'react-hot-toast'
import { SkillsListModal } from '../../components/SkillsListModal/SkillsListModal'
import { getDist } from '../../services/getDist'
import { DeleteAssistantModal } from '../../components/DeleteAssistantModal/DeleteAssistantModal'
import { PublishAssistantModal } from '../../components/PublishAssistantModal/PublishAssistantModal'
import { ShareModal } from '../../components/ShareModal/ShareModal'
import { AreYouSureModal } from '../../components/AreYouSureModal/AreYouSureModal'
import { DeepyHelperTab } from '../../components/Sidebar/components/DeepyHelperTab'
import { SettingsTab } from '../../components/Sidebar/components/SettingsTab'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import { SkillModal } from '../../components/SkillModal/SkillModal'
import { trigger } from '../../utils/events'
import { RoutesList } from '../../router/RoutesList'

export const EditorPage = () => {
  const { options, dispatch } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  // const skillEditorIsActive = options.get(consts.SKILL_EDITOR_IS_ACTIVE)
  const tabsNames = ['Skills', 'Architecture']
  const [activeTab, setActiveTab] = useState<number>(0)
  const auth = useAuth()
  const { name: nameFromURL, skillId } = useParams()
  const { state } = useLocation()
  const nav = useNavigate()

  const { isPreview, setIsPreview } = usePreview()

  const { data: dist } = useQuery(
    ['dist', nameFromURL],
    () => getDist(nameFromURL!),
    {
      refetchOnWindowFocus: false,
      enabled: nameFromURL?.length! > 0,
    }
  )
  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(['components', nameFromURL], () => getComponents(nameFromURL!), {
    refetchOnWindowFocus: false,
    enabled: nameFromURL?.length! > 0,
  })

  const annotators = components?.annotators
  const candidateAnnotators = components?.candidate_annotators
  const skills = components?.skills
  const skillSelectors = components?.skill_selectors
  const responseSelectors = components?.response_selectors
  const responseAnnotators = components?.response_annotators

  useEffect(() => {
    // Setting mode to Preview by default
    setIsPreview(state?.preview ?? true)
  }, [state])

  // TODO: FIX
  useEffect(() => {
    if (skillId && skills)
      trigger('SkillPromptModal', {
        action: 'edit',
        skill: skills?.find((s: any) => s?.name === skillId),
      })
  }, [skillId, skills])

  useEffect(() => {
    dispatch({
      type: 'set',
      option: {
        id: consts.EDITOR_ACTIVE_TAB,
        value: tabsNames[activeTab],
      },
    })

    dispatch({
      type: 'set',
      option: {
        id: consts.ACTIVE_ASSISTANT,
        value: dist,
      },
    })
  }, [dist, activeTab])

  return (
    <>
      <Sidebar>
        <Container layoutForTabs>
          <BaseToolTip id='sidebarSkillTab' content='Skills' place='right' />
          <div
            onClick={() =>
              nav(
                generatePath(RoutesList.editor.default, {
                  name: nameFromURL as string,
                })
              )
            }
          >
            <SkillsTab />
          </div>
          <div
            onClick={() =>
              nav(
                generatePath(RoutesList.editor.architecture, {
                  name: nameFromURL as string,
                })
              )
            }
          >
            <BotTab />
          </div>
          <div style={{ height: '100%' }}></div>
          <div
            style={{
              width: '100%',
              borderTop: '1px solid #F0F0F3',
              paddingTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <DeepyHelperTab />
            <SettingsTab />
          </div>
        </Container>
      </Sidebar>
      <Outlet />
      

      <Toaster />
      <BaseSidePanel />
      <BaseSidePanel transition='left' />
      <AreYouSureModal />
      <SkillPromptModal />
      <Toaster />
      <SkillsListModal />
      <SkillModal />
      <PublishAssistantModal />
      <DeleteAssistantModal />
      <AssistantModal />
      <IntentCatcherModal />
      <IntentResponderModal />
      <SignInModal />
      <ShareModal />
    </>
  )
}
