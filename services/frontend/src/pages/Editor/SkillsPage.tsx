import { useParams } from 'react-router-dom'
import CardsLoader from '../../components/CardsLoader/CardsLoader'
import { ErrorHandler } from '../../components/ErrorHandler/ErrorHandler'
import { Main } from '../../components/Main/Main'
import { SkillList } from '../../components/SkillList/SkillList'
import { useAuth } from '../../context/AuthProvider'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { useComponent } from '../../hooks/useComponent'
import { AddButton } from '../../ui/AddButton/AddButton'
import { Container } from '../../ui/Container/Container'
import { Table } from '../../ui/Table/Table'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { consts } from '../../utils/consts'

const SkillsPage = () => {
  const auth = useAuth()
  const { name } = useParams()
  const { options } = useDisplay()
  const { isPreview } = usePreview()
  const { getAllComponents } = useComponent()
  const components = getAllComponents(name || '')
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  return (
    <Main sidebar editor>
      <Wrapper
        title='Skills'
        skills
        annotation='generate possible responses to the user'
      >
        {components?.error && <ErrorHandler error={components?.error} />}
        {!components?.error && isTableView && (
          <Table
            second='Type'
            addButton={
              !isPreview ? (
                <AddButton
                  forTable
                  forSkills
                  disabled={!auth?.user && isPreview}
                  text='Add Skill'
                />
              ) : undefined
            }
          >
            <SkillList
              skills={components?.data?.skills}
              view='table'
              type='your'
            />
          </Table>
        )}
        {!isTableView && (
          <Container gridForCards heightAuto>
            {!isPreview && <AddButton disabled={isPreview} forGrid forSkills />}
            {components?.data?.skills === undefined && (
              <CardsLoader cardsCount={3} type='skill' />
            )}
            <SkillList
              skills={components?.data?.skills}
              view='cards'
              type='your'
              forGrid
            />
          </Container>
        )}
      </Wrapper>
    </Main>
  )
}

export default SkillsPage
