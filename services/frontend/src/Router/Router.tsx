import { Route, Routes } from 'react-router-dom'
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
      <Route path='draft' element={<DraftPage />} />
      <Route path='/' element={<StartPage />} />
      <Route path='main' element={<BotsPage />} />
      <Route path='bots' element={<BotsAllPage />} />
      <Route path='skills' element={<SkillsPage />} />
      <Route path='allskills' element={<SkillsAllPage />} />
      <Route
        path='editor'
        element={
          <PrivateRoute>
            <EditorPage />
          </PrivateRoute>
        }
      />
      <Route path='test' element={<TestPage />} />
    </Routes>
  )
}
