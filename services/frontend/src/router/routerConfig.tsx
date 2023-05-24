import { generatePath, Link } from 'react-router-dom'
import { BotsAllPage } from '../pages/BotsAllPage'
import { BotsPage } from '../pages/BotsPage'
import { DraftPage } from '../pages/DraftPage'
import { EditorPage } from '../pages/Editor/EditorPage'
import { IntegrationPage } from '../pages/Editor/IntegrationPage'
import SkillEditorPage from '../pages/Editor/SkillEditorPage'
import SkillsPage from '../pages/Editor/SkillsPage'
import ErrorPage from '../pages/ErrorPage'
import { GoogleAuthPage } from '../pages/GoogleAuthPage'
import Root from '../pages/Root'
import { SandboxPage } from '../pages/SandboxPage'
import { TestPage } from '../pages/TestPage/TestPage'
import { UsersBotsPage } from '../pages/UsersBotsPage'
import { CustomRouteConfig } from '../types/types'
import { CrumbForEditor } from '../ui/Breadcrumbs/CrumbForEditor'
import { consts } from '../utils/consts'
import { AdminRoute } from './AdminRoute'
import { PrivateRoute } from './PrivateRoute'
import { RoutesList } from './RoutesList'

export const RouterConfig: CustomRouteConfig[] = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: RoutesList.start,
        element: <BotsPage />,
      },
      {
        path: RoutesList.botsAll,
        element: <BotsAllPage />,
        handle: {
          crumb: () => [<Link to={RoutesList.botsAll}>Public Templates</Link>],
        },
      },
      {
        path: RoutesList.yourBots,
        element: (
          <PrivateRoute>
            <UsersBotsPage />
          </PrivateRoute>
        ),
        handle: {
          crumb: () => [<Link to={RoutesList.yourBots}>Your Assistants</Link>],
        },
      },
      {
        path: RoutesList.editor.default,
        element: <EditorPage />,
        loader: ({ params }) => params,
        handle: {
          crumb: (params: any, options?: any) => {
            const path = generatePath(RoutesList.editor.default, params)
            const display_name = options?.get(
              consts.ACTIVE_ASSISTANT
            )?.display_name
            return [
              display_name && <CrumbForEditor />,
              display_name && <Link to={path}>{display_name}</Link>,
            ]
          },
        },
        children: [
          // {
          //   path: RoutesList.editor.architecture,
          //   element: <ArchitecturePage />,
          //   loader: ({ params }) => params,
          //   handle: {
          //     crumb: (params: any) => [
          //       <Link to={generatePath(RoutesList.editor.architecture, params)}>
          //         Arhitecture
          //       </Link>,
          //     ],
          //   },
          // },
          {
            path: RoutesList.editor.skills,
            element: <SkillsPage />,
            loader: ({ params }) => params,
            handle: {
              crumb: (params: any) => [
                <Link to={generatePath(RoutesList.editor.default, params)}>
                  Skills
                </Link>,
              ],
            },
          },
          {
            path: RoutesList.editor.integration,
            element: <IntegrationPage />,
            loader: ({ params }) => params,
            handle: {
              crumb: (params: any) => [
                <Link to={generatePath(RoutesList.editor.integration, params)}>
                  Integration
                </Link>,
              ],
            },
          },
          {
            path: RoutesList.editor.skillEditor,
            element: (
              <PrivateRoute>
                <SkillEditorPage />
              </PrivateRoute>
            ),
            loader: ({ params }) => params,
            handle: {
              crumb: (params: any, options?: any) => {
                const display_name = options?.get(
                  consts.EDITOR_ACTIVE_SKILL
                )?.display_name
                return [
                  <Link to={generatePath(RoutesList.editor.default, params)}>
                    Skills
                  </Link>,
                  display_name && (
                    <Link
                      to={generatePath(RoutesList.editor.skillEditor, params)}
                    >
                      {display_name}
                    </Link>
                  ),
                ]
              },
            },
          },
        ],
      },
    ],
  },
  {
    path: RoutesList.code,
    element: <GoogleAuthPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
  // Dev pages
  {
    path: RoutesList.test,
    element: (
      <AdminRoute>
        <TestPage />
      </AdminRoute>
    ),
    handle: 'Test Page',
  },
  {
    path: RoutesList.draft,
    element: (
      <AdminRoute>
        <DraftPage />
      </AdminRoute>
    ),
    handle: 'Its For Crumbs',
  },
  {
    path: RoutesList.sandbox,
    element: (
      <AdminRoute>
        <SandboxPage />
      </AdminRoute>
    ),
    handle: 'Its For Crumbs',
  },
]
