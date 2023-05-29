import classNames from 'classnames/bind'
import { FC } from 'react'
import Add from 'assets/icons/+.svg'
import { useAuth } from 'context/AuthProvider'
import { usePreview } from 'context/PreviewProvider'
import { trigger } from 'utils/events'
import s from './AddButton.module.scss'

interface Props {
  text?: string
  disabled?: boolean
  forTable?: boolean
  forGrid?: boolean
  forSkills?: boolean
  fromScratch?: boolean
  onAddRequest?: () => void
}

export const AddButton: FC<Props> = ({
  text,
  // disabled,
  forGrid,
  forTable,
  forSkills,
  fromScratch,
  onAddRequest,
}) => {
  const auth = useAuth()
  const { isPreview } = usePreview()
  const cx = classNames.bind(s)

  const handleClick = () => {
    const isCreateScratchAssistant = !forSkills && !fromScratch
    const isCreateScratchSkill = fromScratch
    const isAddPublicSkill = forSkills && !isPreview
    const scratchAssistant = { action: 'create' }

    if (onAddRequest) onAddRequest()

    if (!auth?.user)
      return trigger(
        'SignInModal',
        isCreateScratchAssistant
          ? {
              requestModal: {
                name: 'AssistantModal',
                options: scratchAssistant,
              },
            }
          : {}
      )
    if (isAddPublicSkill) return trigger('SkillsListModal', {})
    if (isCreateScratchSkill) return trigger('SkillModal', { action: 'create' })
    if (isCreateScratchAssistant)
      return trigger('AssistantModal', scratchAssistant)
  }

  return !forTable ? (
    <button
      onClick={handleClick}
      className={cx(
        'forCard',
        forGrid && 'forGrid',
        forSkills && 'forSkills'
        // disabled && 'disabled'
      )}
    >
      <img src={Add} />
    </button>
  ) : (
    <tbody>
      <tr className={s.tr}>
        <td colSpan={6} className={s.td}>
          <button className={s.forTable} onClick={handleClick}>
            <img src={Add} />
            <p>{text || 'Create From Scratch'}</p>
          </button>
        </td>
      </tr>
    </tbody>
  )
}
