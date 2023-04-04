import { useQuery } from 'react-query'
import { ErrorHandler } from '../../components/ErrorHandler/ErrorHandler'
import { Loader } from '../../components/Loader/Loader'
import { Main } from '../../components/Main/Main'
import { SkillList } from '../../components/SkillList/SkillList'
import { AddButton } from '../../ui/AddButton/AddButton'
import { Container } from '../../ui/Container/Container'
import { Table } from '../../ui/Table/Table'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { useParams } from 'react-router-dom'
import { getComponents } from '../../services/getComponents'
import { useAuth } from '../../context/AuthProvider'
import { consts } from '../../utils/consts'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'

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
  const isTableView = options.get(consts.IS_TABLE_VIEW)
  const { isPreview } = usePreview()

  const skills = components?.skills

  return (
    <Main sidebar editor>
      <Wrapper title='Skills' skills>
        <Loader isLoading={isComponentsLoading} />
        <ErrorHandler error={componentsError} />
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
            {!isPreview && <AddButton disabled={isPreview} forGrid forSkills />}
            <SkillList skills={skills} view='cards' type='your' forGrid />
          </Container>
        )}
      </Wrapper>
    </Main>
  )
}

export default SkillsPage
