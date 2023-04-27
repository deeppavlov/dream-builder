import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { Outlet, useParams } from 'react-router-dom'
import { AreYouSureModal } from '../../components/AreYouSureModal/AreYouSureModal'
import { AssistantModal } from '../../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../../components/BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import { CreateGenerativeSkillModal } from '../../components/CreateGenerativeSkillModal/CreateGenerativeSkillModal'
import { DeleteAssistantModal } from '../../components/DeleteAssistantModal/DeleteAssistantModal'
import { DeleteSkillModal } from '../../components/DeleteSkillModal/DeleteSkillModal'
import IntentCatcherModal from '../../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderModal from '../../components/IntentResponderModal/IntentResponderModal'
import { PublishAssistantModal } from '../../components/PublishAssistantModal/PublishAssistantModal'
import { ShareModal } from '../../components/ShareModal/ShareModal'
import { DeepyHelperTab } from '../../components/Sidebar/components/DeepyHelperTab'
import { SettingsTab } from '../../components/Sidebar/components/SettingsTab'
import { SkillsTab } from '../../components/Sidebar/components/SkillsTab'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { SignInModal } from '../../components/SignInModal/SignInModal'
import { SkillModal } from '../../components/SkillModal/SkillModal'
import SkillPromptModal from '../../components/SkillPromptModal/SkillPromptModal'
import { SkillQuitModal } from '../../components/SkillQuitModal/SkillQuitModal'
import { SkillsListModal } from '../../components/SkillsListModal/SkillsListModal'
import { TOOLTIP_DELAY } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { getComponents } from '../../services/getComponents'
import { getDist } from '../../services/getDist'
import { Container } from '../../ui/Container/Container'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'

export const EditorPage = () => {
  const { options, dispatch } = useDisplay()
  const tabsNames = ['Skills', 'Architecture']
  const skillEditorIsActive = options.get(consts.EDITOR_ACTIVE_SKILL)
  const [activeTab, setActiveTab] = useState<number>(0)
  const { name: nameFromURL, skillId } = useParams()

  const { setIsPreview } = usePreview()

  const { data: dist } = useQuery(
    ['dist', nameFromURL],
    () => getDist(nameFromURL!),
    {
      refetchOnWindowFocus: false,
      enabled: nameFromURL?.length! > 0,
    }
  )
  const { data: components } = useQuery(
    ['components', nameFromURL],
    () => getComponents(nameFromURL!),
    {
      refetchOnWindowFocus: false,
      enabled: nameFromURL?.length! > 0,
    }
  )

  const skills = components?.skills

  useEffect(() => {
    // Setting mode to Preview by default
    if (dist !== undefined && dist !== null) {
      setIsPreview(dist?.visibility === 'public_template')
    }
    return () => setIsPreview(true)
  }, [dist])

  // TODO: FIX
  useEffect(() => {
    if (skillId && skills) {
      return trigger('SkillPromptModal', {
        action: 'edit',
        skill: skills?.find((s: any) => s?.name === skillId),
      })
    }

    if (skillEditorIsActive) trigger('SkillPromptModal', { isOpen: false })
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
          
          <SkillsTab isActive={true} />
          {/* <BotTab /> */}
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
      <SkillsListModal />
      <BaseSidePanel />
      <BaseSidePanel transition='left' />
      <AreYouSureModal />
      <SkillPromptModal />
      <SkillQuitModal />
      <Toaster />
      <PublishAssistantModal />
      <DeleteAssistantModal />
      <AssistantModal />
      <IntentCatcherModal />
      <IntentResponderModal />
      <SignInModal />
      <ShareModal />
      <DeleteSkillModal />
      <SkillModal />
      <CreateGenerativeSkillModal />
    </>
  )
}
