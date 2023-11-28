import { useUIOptions } from 'context';
import { useEffect, useState } from 'react';
import { Outlet, useMatch, useParams } from 'react-router-dom';
import { RoutesList } from 'router/RoutesList';
import { usePreview } from 'context/PreviewProvider';
import { VISIBILITY_STATUS } from 'constants/constants';
import { useAssistants } from 'hooks/api';
import { consts } from 'utils/consts';
import { AssistantModal, DeleteAssistantModal, DeleteSkillModal, PublishAssistantModal, ShareAssistantModal, SignInModal, SkillModal, SkillQuitModal, SkillsListModal } from 'components/Modals';
import { BaseSidePanel } from 'components/Panels';
import { Container } from 'components/UI';
import { Sidebar } from 'components/Widgets';
import { AssistantMenuInfo, DeepyHelperTab, IntegrationTab, SettingsTab, SkillsTab } from 'components/Widgets/Sidebar';


export const EditorPage = () => {
  const { setUIOption } = useUIOptions()
  const { name } = useParams()
  const { setIsPreview } = usePreview()
  const { getDist } = useAssistants()
  const { data: dist } = getDist(
    { distName: name! },
    { useErrorBoundary: true, refetchOnMount: true }
  )

  useEffect(() => {
    // Setting mode to Preview by default
    if (dist !== undefined && dist !== null) {
      setIsPreview(dist?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE)
      setUIOption({
        name: consts.ACTIVE_ASSISTANT,
        value: dist,
      })
    }

    return () => setIsPreview(true)
  }, [dist])

  const isEditor = Boolean(useMatch(RoutesList.editor.default))
  const isSkills = Boolean(useMatch(RoutesList.editor.skills.slice(0, -1)))
  const isSkillEditor = Boolean(useMatch(RoutesList.editor.skillEditor))
  const isIntegration = Boolean(useMatch(RoutesList.editor.integration))
  //   const BotTabActive = Boolean(useMatch(RoutesList.editor.architecture))

  return (
    <>
      <Sidebar>
        <Container layoutForTabs>
          <SkillsTab isActive={isSkills || isSkillEditor || isEditor} />
          <IntegrationTab isActive={isIntegration} />
          {/* <BotTab isActive={BotTabActive} /> */}
        </Container>
        <Container layoutForBottomBtns>
          <DeepyHelperTab />
          <AssistantMenuInfo  />
          <SettingsTab />
        </Container>
      </Sidebar>
      <Outlet />
      <SkillsListModal />
      <BaseSidePanel />
      <SkillQuitModal />
      <PublishAssistantModal />
      <DeleteAssistantModal />
      <AssistantModal />
      <SignInModal />
      <ShareAssistantModal />
      <DeleteSkillModal />
      <SkillModal />
    </>
  )
}