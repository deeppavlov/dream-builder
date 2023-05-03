import { generatePath, Link } from 'react-router-dom'
import { BotsAllPage } from '../pages/BotsAllPage'
import { BotsPage } from '../pages/BotsPage'
import { DraftPage } from '../pages/DraftPage'
import { EditorPage } from '../pages/Editor/EditorPage'
import SkillsPage from '../pages/Editor/SkillsPage'
import { GoogleAuthPage } from '../pages/GoogleAuthPage'
import { ProfilePage } from '../pages/ProfilePage'
import Root from '../pages/Root'
import { TestPage } from '../pages/TestPage/TestPage'
import { UsersBotsPage } from '../pages/UsersBotsPage'
import { CustomRouteConfig } from '../types/types'
import { CrumbForEditor } from '../ui/Breadcrumbs/CrumbForEditor'
import { consts } from '../utils/consts'
import { PrivateRoute } from './PrivateRoute'
import { RoutesList } from './RoutesList'
import { SanboxPage } from '../pages/SanboxPage'

export const RouterConfig: CustomRouteConfig[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: RoutesList.start,
        element: <BotsPage />,
      },
      {
        path: RoutesList.botsAll,
        element: <BotsAllPage />,
        handle: {
          crumb: () => [
            <Link to={RoutesList.botsAll}>Assistant Templates</Link>,
          ],
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

            children: [
              {
                path: RoutesList.editor.skillEditor,
                element: <SkillsPage />,
                loader: ({ params }) => params,
                handle: {
                  crumb: (params: any, options?: any) => {
                    const display_name = options?.get(
                      consts.EDITOR_ACTIVE_SKILL
                    )?.display_name
                    return [
                      display_name && (
                        <Link
                          to={generatePath(
                            RoutesList.editor.skillEditor,
                            params
                          )}
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
        path: RoutesList.profile,
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
        handle: {
          crumb: () => [
            <Link to={RoutesList.profile}>Connected Services</Link>,
          ],
        },
      },
    ],
  },
  {
    path: RoutesList.code,
    element: <GoogleAuthPage />,
  },
  // Dev pages
  {
    path: RoutesList.test,
    element: <TestPage />,
    handle: 'Test Page',
  },
  {
    path: RoutesList.draft,
    element: <DraftPage />,
    handle: 'Its For Crumbs',
  },
  {
    path: RoutesList.sandbox,
    element: <SanboxPage />,
    handle: 'Its For Crumbs',
  },
]
