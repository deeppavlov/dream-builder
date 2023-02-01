import { Route, Routes } from 'react-router-dom'
import { RoutesList } from './RoutesList'
import { BotsAllPage } from '../pages/BotsAllPage'
import { EditorPage } from '../pages/EditorPage'
import { BotsPage } from '../pages/BotsPage'
import { SkillsAllPage } from '../pages/SkillsAllPage'
import { SkillsPage } from '../pages/SkillsPage'
import { StartPage } from '../pages/StartPage'
import { TestPage } from '../pages/TestPage/TestPage'
import { DraftPage } from '../pages/DraftPage'
import { PrivateRoute } from './PrivateRoute'
import { UsersBotsPage } from '../pages/UsersBotsPage'
import { UsersSkillsPage } from '../pages/UsersSkillsPage'

export const Router = () => {
  return (
    <Routes>
      <Route path={RoutesList.draft} element={<DraftPage />} />
      <Route path={RoutesList.start} element={<StartPage />} />
      <Route path={RoutesList.bots} element={<BotsPage />} />
      <Route path={RoutesList.botsAll} element={<BotsAllPage />} />
      <Route path={RoutesList.yourBots} element={<UsersBotsPage />} />
      <Route path={RoutesList.yourSkills} element={<UsersSkillsPage />} />
      <Route path={RoutesList.skills} element={<SkillsPage />} />
      <Route path={RoutesList.skillsAll} element={<SkillsAllPage />} />
      <Route
        path={':name'}
        element={
          <PrivateRoute>
            <EditorPage />
          </PrivateRoute>
        }
      />
      <Route path={RoutesList.test} element={<TestPage />} />
    </Routes>
  )
}
