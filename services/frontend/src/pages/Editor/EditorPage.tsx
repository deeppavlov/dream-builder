import { useDisplay } from 'context'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet, useMatch, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { useAssistants } from 'hooks/api'
import { consts } from 'utils/consts'
import {
  AreYouSureModal,
  AssistantModal,
  DeleteAssistantModal,
  DeleteSkillModal,
  IntentCatcherModal,
  IntentResponderModal,
  PublishAssistantModal,
  ShareAssistantModal,
  SignInModal,
  SkillModal,
  SkillQuitModal,
  SkillsListModal,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container } from 'components/UI'
import { Sidebar } from 'components/Widgets'
import {
  DeepyHelperTab,
  IntegrationTab,
  SettingsTab,
  SkillsTab,
} from 'components/Widgets/Sidebar'

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
      setIsPreview(dist?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE)
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
