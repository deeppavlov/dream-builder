import { Route, Routes } from 'react-router-dom'
import { BotsAllPage } from '../pages/BotsAllPage'
import { EditorPage } from '../pages/EditorPage'
import { BotsPage } from '../pages/BotsPage'
import { SkillsAllPage } from '../pages/SkillsAllPage'
import { SkillsPage } from '../pages/SkillsPage'
import { StartPage } from '../pages/StartPage'
import { HomePage } from '../pages/HomePage'
import { TestPage } from '../pages/TestPage/TestPage'

export const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='start' element={<StartPage />} />
      <Route path='main' element={<BotsPage />} />
      <Route path='bots' element={<BotsAllPage />} />
      <Route path='skills' element={<SkillsPage />} />
      <Route path='allskills' element={<SkillsAllPage />} />
      <Route path='editor' element={<EditorPage />} />
      <Route path='test' element={<TestPage />} />
    </Routes>
  )
}
