import { Main } from '../components/Main/Main'
import { MenuList } from '../components/MenuList/MenuList'
import { Topbar } from '../components/Topbar/Topbar'
import { Container } from '../ui/Container/Container'
import { KebabButton } from '../ui/KebabButton/KebabButton'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { useTooltip } from '../hooks/useTooltip'

const style = {
  width: '100px',
  height: '48px',
  borderRadius: '12px',
  backgroundColor: 'lightgrey',
}

export const DraftPage = () => {
  useTooltip()
  return (
    <>
      <Topbar />
      <Main>
        <Wrapper height='100%' width='100%'>
          <Container
            alignItems='center'
            justifyContent='center'
            width='100%'
            height='100%'>
            <button style={style} data-tip data-for='bot_public'>
              public bot
              <MenuList type='bot_public' />
            </button>
            <button style={style} data-tip data-for='your_bot'>
              your bot
              <MenuList type='your_bot' />
            </button>
            <button style={style} data-tip data-for='skills'>
              skill
              <MenuList type='skills' />
            </button>
            <button style={style} data-tip data-for='all_annotators'>
              all annotators
              <MenuList type='all_annotators' />
            </button>
            <button style={style} data-tip data-for='all_skills'>
              all skills
              <MenuList type='all_skills' />
            </button>
            <button style={style} data-tip data-for='customizable_annotator'>
              customizable annotator
              <MenuList type='customizable_annotator' />
            </button>
            <button style={style} data-tip data-for='customizable_skill'>
              customizable skill
              <MenuList type='customizable_skill' />
            </button>
            <button
              style={style}
              data-tip
              data-for='non_customizable_annotator'>
              non customizable annotator
              <MenuList type='non_customizable_annotator' />
            </button>
            <button style={style} data-tip data-for='non_customizable_skill'>
              non customizable skill
              <MenuList type='non_customizable_skill' />
            </button>
            <button style={style} data-tip data-for='skill_selector'>
              skill selector
              <MenuList type='skill_selector' />
            </button>
            <button style={style} data-tip data-for='response_selector'>
              response selector
              <MenuList type='response_selector' />
            </button>
            <button style={style} data-tip data-for='bots'>
              menu_bots
              <MenuList type='bots' />
            </button>
            <button style={style} data-tip data-for='menu_skills'>
              menu_skills
              <MenuList type='skills' />
            </button>
            <button style={style} data-tip data-for='menu_editor'>
              menu_editor
              <MenuList type='editor' />
            </button>
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}

{
  /* <KebabButton data-html wrapper data-tip data-for='bots_menu' /> */
}
