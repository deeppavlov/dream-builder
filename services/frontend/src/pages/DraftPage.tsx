import { AreYouSureModal } from '../components/AreYouSureModal/AreYouSureModal'
import { DeleteSkillModal } from '../components/DeleteSkillModal/DeleteSkillModal'
import { FreezeSkillModal } from '../components/FreezeSkillModal/FreezeSkillModal'
import { Main } from '../components/Main/Main'
import { mockSkills } from '../mocks/database/mockSkills'
import Button from '../ui/Button/Button'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { trigger } from '../utils/events'

export const DraftPage = () => {
  const skill = mockSkills[0]

  const handleDSClick = () => {
    trigger('DeleteSkillModal', skill)
  }
  const handleAYSClick = () => {
    trigger('AreYouSureModal', {})
  }
  const handleFSClick = () => {
    trigger('FreezeSkillModal', skill)
  }

  return (
    <>
      <Main>
        <Wrapper skills>
          <Button theme='primary' props={{ onClick: handleAYSClick }}>
            Trigger AYS Modal
          </Button>
          <Button theme='primary' props={{ onClick: handleDSClick }}>
            Trigger DS Modal
          </Button>
          <Button theme='primary' props={{ onClick: handleFSClick }}>
            Trigger FS Modal
          </Button>
        </Wrapper>
      </Main>
      <AreYouSureModal />
      <DeleteSkillModal />
      <FreezeSkillModal />
    </>
  )
}
