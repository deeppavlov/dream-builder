import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet, useMatch, useParams } from 'react-router-dom'
import { AreYouSureModal } from '../../components/AreYouSureModal/AreYouSureModal'
import { AssistantModal } from '../../components/AssistantModal/AssistantModal'
import { BaseSidePanel } from '../../components/BaseSidePanel/BaseSidePanel'
import { DeleteAssistantModal } from '../../components/DeleteAssistantModal/DeleteAssistantModal'
import { DeleteSkillModal } from '../../components/DeleteSkillModal/DeleteSkillModal'
import IntentCatcherModal from '../../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderModal from '../../components/IntentResponderModal/IntentResponderModal'
import { PublishAssistantModal } from '../../components/PublishAssistantModal/PublishAssistantModal'
import { ShareAssistantModal } from '../../components/ShareAssistantModal/ShareAssistantModal'
import { DeepyHelperTab } from '../../components/Sidebar/components/DeepyHelperTab'
import { IntegrationTab } from '../../components/Sidebar/components/IntegrationTab'
import { SettingsTab } from '../../components/Sidebar/components/SettingsTab'
import { SkillsTab } from '../../components/Sidebar/components/SkillsTab'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { SignInModal } from '../../components/SignInModal/SignInModal'
import { SkillModal } from '../../components/SkillModal/SkillModal'
import { SkillQuitModal } from '../../components/SkillQuitModal/SkillQuitModal'
import { SkillsListModal } from '../../components/SkillsListModal/SkillsListModal'
import { VisibilityStatus } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { useAssistants } from '../../hooks/useAssistants'
import { RoutesList } from '../../router/RoutesList'
import { Container } from '../../ui/Container/Container'
import { consts } from '../../utils/consts'

export const EditorPage = () => {
  const { dispatch } = useDisplay()
  const { name } = useParams()
  const { setIsPreview } = usePreview()
  const { getDist } = useAssistants()
  const { data: dist } = getDist({
    distName: name!,
    useErrorBoundary: true,
    refetchOnMount: true,
  })

  useEffect(() => {
    // Setting mode to Preview by default
    if (dist !== undefined && dist !== null) {
      setIsPreview(dist?.visibility === VisibilityStatus.PUBLIC_TEMPLATE)
      dispatch({
        type: 'set',
        option: {
          id: consts.ACTIVE_ASSISTANT,
          value: dist,
        },
      })
    }

    return () => setIsPreview(true)
  }, [dist])

  // useEffect(() => {
  //   const error = (errorResponse as any)?.response as Response

  //   if (error?.status === undefined) return
  //   console.log('aboba')

  //   // return nav(
  //   //   generatePath(RoutesList.error, { statusCode: error.status.toString() }),
  //   //   { state: Object.assign({}, state, { error }), replace: true }
  //   // )
  // }, [isError])

  return (
    <>
      <Sidebar>
        <Container layoutForTabs>
          <SkillsTab
            isActive={Boolean(useMatch(RoutesList.editor.skills.slice(0, -1)))}
          />
          <IntegrationTab
            isActive={Boolean(useMatch(RoutesList.editor.integration))}
          />
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
      <AreYouSureModal />
      <SkillQuitModal />
      <Toaster />
      <PublishAssistantModal />
      <DeleteAssistantModal />
      <AssistantModal />
      <IntentCatcherModal />
      <IntentResponderModal />
      <SignInModal />
      <ShareAssistantModal />
      <DeleteSkillModal />
      <SkillModal />
    </>
  )
}
