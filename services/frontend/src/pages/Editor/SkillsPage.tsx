import { useParams } from 'react-router-dom'
import { AssistantModule } from '../../components/AssistantModule/AssistantModule'
import { TRIGGER_RIGHT_SP_EVENT } from '../../components/BaseSidePanel/BaseSidePanel'
import CardsLoader from '../../components/CardsLoader/CardsLoader'
import { ErrorHandler } from '../../components/ErrorHandler/ErrorHandler'
import { Main } from '../../components/Main/Main'
import ReadFirstSidePanel from '../../components/ReadFirstSidepanel/ReadFisrstSidePanel'
import { SkillList } from '../../components/SkillList/SkillList'
import SvgIcon from '../../components/SvgIcon/SvgIcon'
import { SwitchViewButton } from '../../components/SwitchViewButton/SwitchViewButton'
import TableRowsLoader from '../../components/TableRowsLoader/TableRowsLoader'
import { useAuth } from '../../context/AuthProvider'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { useComponent } from '../../hooks/useComponent'
import { AddButton } from '../../ui/AddButton/AddButton'
import Button from '../../ui/Button/Button'
import { Container } from '../../ui/Container/Container'
import { Table } from '../../ui/Table/Table'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'

const SkillsPage = () => {
  const auth = useAuth()
  const { name } = useParams()
  const { options } = useDisplay()
  const { isPreview } = usePreview()
  const { getAllComponents } = useComponent()
  const components = getAllComponents(name || '', {refetchOnMount: true})
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  const handleReadFirst = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, { children: <ReadFirstSidePanel /> })

  return (
    <Main sidebar column>
      <AssistantModule />
      <Wrapper
        fitScreen
        title='Skills'
        annotation='Your AI assistant is multi-skill which means that at each step in the conversation your Assistant picks the skill to create the response.'
        btns={
          <Container>
            {!isPreview && (
              <Button
                withIcon
                theme='tertiary2'
                props={{ onClick: handleReadFirst }}
              >
                <SvgIcon iconName={'attention'} />
                Read First!
              </Button>
            )}
            <SwitchViewButton />
          </Container>
        }
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
            {components.isLoading && (
              <TableRowsLoader rowsCount={4} colCount={6} />
            )}
            <SkillList
              skills={components?.data?.skills!}
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
              skills={components?.data?.skills!}
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
