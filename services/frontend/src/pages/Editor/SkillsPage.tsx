import { useAuth, useUIOptions } from 'context'
import { useParams } from 'react-router-dom'
import { usePreview } from 'context/PreviewProvider'
import { useComponent } from 'hooks/api'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { AddButton, Button, SwitchViewButton } from 'components/Buttons'
import { SkillList, SvgIcon } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import { AssistantModule } from 'components/Modules'
import { ReadFirstSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Container, ErrorHandler, Main, Table, Wrapper } from 'components/UI'

const SkillsPage = () => {
  const auth = useAuth()
  const { name } = useParams()
  const { UIOptions } = useUIOptions()
  const { isPreview } = usePreview()
  const { getAllComponents } = useComponent()
  const components = getAllComponents(name || '', { refetchOnMount: true })
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

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
