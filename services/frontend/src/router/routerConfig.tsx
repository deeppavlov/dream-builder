import { AdminPage } from 'pages/AdminPage/AdminPage'
import { PublicationRequestsPage } from 'pages/AdminPage/PublicationRequestsPage'
import UsersPage from 'pages/AdminPage/UsersPage'
import { AuthPage } from 'pages/AuthPage'
import { EditorPage } from 'pages/Editor/EditorPage'
import { IntegrationPage } from 'pages/Editor/IntegrationPage'
import SkillEditorPage from 'pages/Editor/SkillEditorPage'
import SkillsPage from 'pages/Editor/SkillsPage'
import ErrorPage from 'pages/ErrorPage'
import { HomePage } from 'pages/HomePage'
import { MyAssistantsPage } from 'pages/MyAssistantsPage'
import { PublicTemplatesPage } from 'pages/PublicTemplatesPage'
import Root from 'pages/Root'
import { Link, generatePath } from 'react-router-dom'
import { AdminRoute } from 'router/AdminRoute'
import { PrivateRoute } from 'router/PrivateRoute'
import { RoutesList } from 'router/RoutesList'
import { CustomRouteConfig, IRouterCrumb } from 'types/types'
import { consts } from 'utils/consts'
import { CrumbForEditor } from 'components/Widgets/Topbar/components/Breadcrumbs/CrumbForEditor'

export const RouterConfig: CustomRouteConfig[] = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: RoutesList.start,
        element: <HomePage />,
      },
      {
        path: RoutesList.botsAll,
        element: <PublicTemplatesPage />,
        handle: {
          crumb: ({ t }: IRouterCrumb) => [
            <Link to={RoutesList.botsAll}>
              {t('breadcrumbs.public_templates')}
            </Link>,
          ],
        },
      },
      {
        path: RoutesList.yourBots,
        element: (
          <PrivateRoute>
            <MyAssistantsPage />
          </PrivateRoute>
        ),
        handle: {
          crumb: ({ t }: IRouterCrumb) => [
            <Link to={RoutesList.yourBots}>
              {t('breadcrumbs.your_assistants')}
            </Link>,
          ],
        },
      },
      {
        path: RoutesList.editor.default,
        element: <EditorPage />,
        loader: ({ params }) => params,
        handle: {
          crumb: ({ params, ui }: IRouterCrumb) => {
            const path = generatePath(RoutesList.editor.default, params)
            const display_name = ui?.[consts.ACTIVE_ASSISTANT]?.display_name
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
              crumb: ({ params, t }: IRouterCrumb) => [
                <Link to={generatePath(RoutesList.editor.default, params)}>
                  {t('breadcrumbs.skills')}
                </Link>,
              ],
            },
          },
          {
            path: RoutesList.editor.integration,
            element: <IntegrationPage />,
            loader: ({ params }) => params,
            handle: {
              crumb: ({ params, t }: IRouterCrumb) => [
                <Link to={generatePath(RoutesList.editor.integration, params)}>
                  {t('breadcrumbs.integration')}
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
              crumb: ({ params, ui, t }: IRouterCrumb) => {
                const display_name =
                  ui?.[consts.EDITOR_ACTIVE_SKILL]?.display_name
                return [
                  <Link to={generatePath(RoutesList.editor.default, params)}>
                    {t('breadcrumbs.skills')}
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
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <ErrorPage status={404} />,
  },
  // Dev pages

  {
    path: RoutesList.admin.default,
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
    loader: ({ params }) => params,
    handle: {
      crumb: ({ t }: IRouterCrumb) => {
        return [
          <Link to={RoutesList.admin.default}>{t('breadcrumbs.admin')}</Link>,
        ]
      },
    },
    children: [
      {
        path: RoutesList.admin.requests,
        element: <PublicationRequestsPage />,
        handle: {
          crumb: ({ t }: IRouterCrumb) => {
            return [
              <Link to={RoutesList.admin.requests}>
                {t('breadcrumbs.requests')}
              </Link>,
            ]
          },
        },
      },
      {
        path: RoutesList.admin.users,
        element: <UsersPage />,
        handle: {
          crumb: ({ t }: IRouterCrumb) => {
            return [
              <Link to={RoutesList.admin.users}>{t('breadcrumbs.users')}</Link>,
            ]
          },
        },
      },
    ],
  },
]
