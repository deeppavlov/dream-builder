import { Link, generatePath } from 'react-router-dom'
import { consts } from '../utils/consts'
import Root from '../pages/Root'
import { BotsAllPage } from '../pages/BotsAllPage'
import { BotsPage } from '../pages/BotsPage'
import { DraftPage } from '../pages/DraftPage'
import { EditorPage } from '../pages/Editor/EditorPage'
import { GoogleAuthPage } from '../pages/GoogleAuthPage'
import { ProfilePage } from '../pages/ProfilePage'
import { TestPage } from '../pages/TestPage/TestPage'
import { UsersBotsPage } from '../pages/UsersBotsPage'
import { CustomRouteConfig } from '../types/types'
import { CrumbForEditor } from '../ui/Breadcrumbs/CrumbForEditor'
import ArchitecturePage from '../pages/Editor/ArchitecturePage'
import SkillsPage from '../pages/Editor/SkillsPage'
import { PrivateRoute } from './PrivateRoute'
import { RoutesList } from './RoutesList'

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
            <Link to={RoutesList.botsAll}>
              Public Virtual Assistants & Chatbots
            </Link>,
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
          crumb: () => [
            <Link to={RoutesList.yourBots}>
              Your Virtual Assistants & Chatbots
            </Link>,
          ],
        },
      },
      {
        path: RoutesList.editor.default,
        element: <EditorPage />,
        loader: ({ params }) => params,
        handle: {
          crumb: (params: any, options?: any) => {
            const path = generatePath(RoutesList.editor.default, params)
            return [
              <CrumbForEditor />,
              <Link to={path}>
                {options?.get(consts.ACTIVE_ASSISTANT)?.display_name}
              </Link>,
            ]
          },
        },
        children: [
          {
            path: RoutesList.editor.architecture,
            element: <ArchitecturePage />,
            loader: ({ params }) => params,
            handle: {
              crumb: (params: any) => [
                <Link to={generatePath(RoutesList.editor.architecture, params)}>
                  Arhitecture
                </Link>,
              ],
            },
          },
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
                    return [
                      <Link
                        to={generatePath(RoutesList.editor.skillEditor, params)}
                      >
                        {options?.get(consts.EDITOR_ACTIVE_SKILL)?.display_name}
                      </Link>,
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
]
