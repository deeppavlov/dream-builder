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

export const Router = () => {
  return (
    <Routes>
      <Route path={RoutesList.draft} element={<DraftPage />} />
      <Route path={RoutesList.start} element={<StartPage />} />
      <Route path={RoutesList.bots} element={<BotsPage />} />
      <Route path={RoutesList.botsAll} element={<BotsAllPage />} />
      <Route path={RoutesList.skills} element={<SkillsPage />} />
      <Route path={RoutesList.skillsAll} element={<SkillsAllPage />} />
       <Route path={RoutesList.editor}
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
