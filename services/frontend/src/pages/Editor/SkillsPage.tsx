import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { ErrorHandler } from '../../components/ErrorHandler/ErrorHandler'
import { Loader } from '../../components/Loader/Loader'
import { Main } from '../../components/Main/Main'
import { SkillList } from '../../components/SkillList/SkillList'
import { useAuth } from '../../context/AuthProvider'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { getComponents } from '../../services/getComponents'
import { AddButton } from '../../ui/AddButton/AddButton'
import { Container } from '../../ui/Container/Container'
import { Table } from '../../ui/Table/Table'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { consts } from '../../utils/consts'

const SkillsPage = () => {
  const auth = useAuth()
  const { name } = useParams()
  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(['components', name], () => getComponents(name!), {
    refetchOnWindowFocus: false,
    enabled: name?.length! > 0,
  })
  const { options } = useDisplay()
  const { isPreview } = usePreview()
  const skillEditorIsActive = options.get(consts.EDITOR_ACTIVE_SKILL)
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  const skills = components?.skills

  return (
    <Main sidebar editor>
      {!skillEditorIsActive && (
        <Wrapper
          title='Skills'
          skills
          annotation='generate possible responses to the user'
        >
          {isTableView && (
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
              <SkillList skills={skills} view='table' type='your' />
            </Table>
          )}
          {!isTableView && (
            <Container gridForCards heightAuto>
              {!isPreview && (
                <AddButton disabled={isPreview} forGrid forSkills />
              )}
              <ErrorHandler error={componentsError} />
              <Loader isLoading={isComponentsLoading} />
              <SkillList skills={skills} view='cards' type='your' forGrid />
            </Container>
          )}
        </Wrapper>
      )}
    </Main>
  )
}

export default SkillsPage
