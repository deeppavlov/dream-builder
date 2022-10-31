import { Route, Routes } from 'react-router-dom'

import { BotsPage } from '../pages/BotsPage'
import { EditorPage } from '../pages/EditorPage'
import { ErrorPage } from '../pages/ErrorPage'
import { MainPage } from '../pages/MainPage'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'
import { SkillsAllPage } from '../pages/SkillsAllPage'
import { SkillsPage } from '../pages/SkillsPage'
import { StartPage } from '../pages/StartPage'

export const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<StartPage />} />
      <Route path='signin' element={<SignInPage />} />
      <Route path='signup' element={<SignUpPage />} />
      <Route path='main' element={<MainPage />} />
      <Route path='bots' element={<BotsPage />} />
      <Route path='skills' element={<SkillsPage />} />
      <Route path='allskills' element={<SkillsAllPage />} />
      <Route path='editor' element={<EditorPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}
