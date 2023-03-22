import { BotsAllPage } from '../pages/BotsAllPage'
import { BotsPage } from '../pages/BotsPage'
import { DraftPage } from '../pages/DraftPage'
import { EditorPage } from '../pages/EditorPage'
import { GoogleAuthPage } from '../pages/GoogleAuthPage'
import { StartPage } from '../pages/StartPage'
import { TestPage } from '../pages/TestPage/TestPage'
import { UsersBotsPage } from '../pages/UsersBotsPage'
import { CustomRouteConfig } from '../types/types'
import { CrumbForEditor } from '../ui/Breadcrumbs/CrumbForEditor'
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
    path: ':name',
    element: <EditorPage />,
    handle: <CrumbForEditor />,
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
