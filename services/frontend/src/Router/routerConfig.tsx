import { Link } from 'react-router-dom'
import { BotsAllPage } from '../pages/BotsAllPage'
import { BotsPage } from '../pages/BotsPage'
import { DraftPage } from '../pages/DraftPage'
import { EditorPage } from '../pages/EditorPage'
import { GoogleAuthPage } from '../pages/GoogleAuthPage'
import { SkillsAllPage } from '../pages/SkillsAllPage'
import { SkillsPage } from '../pages/SkillsPage'
import { StartPage } from '../pages/StartPage'
import { TestPage } from '../pages/TestPage/TestPage'
import { UsersBotsPage } from '../pages/UsersBotsPage'
import { UsersSkillsPage } from '../pages/UsersSkillsPage'
import { CustomRouteConfig } from '../types/types'
import { PrivateRoute } from './PrivateRoute'
import { RoutesList } from './RoutesList'

export const routeConfig: CustomRouteConfig[] = [
  {
    path: RoutesList.start,
    element: <BotsPage />,
  },
  {
    path: RoutesList.botsAll,
    element: <BotsAllPage />,
    handle: 'Public Virtual Assistants & Chatbots',
  },
  {
    path: RoutesList.draft,
    element: <DraftPage />,
    handle: 'Its For Crumbs',
  },
  {
    path: RoutesList.profile,
    element: (
      <PrivateRoute>
        <StartPage />
      </PrivateRoute>
    ),
    handle: 'Connected Services',
  },
  {
    path: RoutesList.yourBots,
    element: (
      <PrivateRoute>
        <UsersBotsPage />
      </PrivateRoute>
    ),
    handle: 'Your Virtual Assistants & Chatbots',
  },
  {
    path: RoutesList.yourSkills,
    element: (
      <PrivateRoute>
        <UsersSkillsPage />
      </PrivateRoute>
    ),
    handle: 'Your Skills',
  },
  {
    path: RoutesList.skills,
    element: <SkillsPage />,
    handle: 'Public Skills',
  },
  {
    path: RoutesList.skillsAll,
    element: <SkillsAllPage />,
    handle: 'All Public Skills',
  },
  {
    path: ':name',
    element: <EditorPage />,
    handle: <Link to={RoutesList.start}>Virtual Assistants & Chatbots</Link>,
  },
  {
    path: RoutesList.test,
    element: <TestPage />,
    handle: 'Test Page',
  },
  {
    path: RoutesList.code,
    element: <GoogleAuthPage />,
  },
]
