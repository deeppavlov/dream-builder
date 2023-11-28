import { useAuth, useUIOptions } from 'context'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { useAssistants, useComponent } from 'hooks/api'
import { consts } from 'utils/consts'
import { AddButton, SwitchViewButton } from 'components/Buttons'
import { SkillList } from 'components/Helpers'
import { CardsLoader, TableRowsLoader } from 'components/Loaders'
import { AssistantModule } from 'components/Modules'
import {
  Container,
  Details,
  ErrorHandler,
  Main,
  Table,
  Wrapper,
} from 'components/UI'

const SkillsPage = () => {
  const auth = useAuth()
  const { name } = useParams()
  const { UIOptions } = useUIOptions()
  const { isPreview } = usePreview()
  const { t } = useTranslation()
  const { getAllComponents } = useComponent()
  const { getDist } = useAssistants()
  const navigate = useNavigate()
  const components = getAllComponents(name || '', { refetchOnMount: true })
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]
  const { data: dist } = getDist({ distName: name })

  useEffect(() => {
    if (!auth.user && dist?.visibility !== VISIBILITY_STATUS.PUBLIC_TEMPLATE)
      navigate('/')
  }, [auth.user])

  // const handleReadFirst = () =>
  //   trigger(TRIGGER_RIGHT_SP_EVENT, { children: <ReadFirstSidePanel /> })

  return (
    <Main sidebar column>
      <AssistantModule />
      <Wrapper
        fitScreen
        title={t('assistant_page.skills_tab.wrapper.title')}
        btns={
          <Container>
            {/* {!isPreview && (
              <Button
                withIcon
                theme='tertiary2'
                props={{ onClick: handleReadFirst }}
              >
                <SvgIcon iconName={'attention'} />
                Read First!
              </Button>
            )} */}
            <SwitchViewButton />
          </Container>
        }
      >
        <Details>{t('assistant_page.skills_tab.wrapper.annotation')}</Details>
        {components?.error && <ErrorHandler error={components?.error} />}
        {!components?.error && isTableView && (
          <Table
            headers={[
              t('skill_table.name'),
              t('skill_table.type'),
              t('skill_table.desc'),
              t('skill_table.created'),
              t('skill_table.actions'),
            ]}
            addButton={
              !isPreview ? (
                <AddButton
                  forTable
                  forSkills
                  disabled={!auth?.user && isPreview}
                  text={t('skill_table.add_btn')}
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
