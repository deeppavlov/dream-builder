import classNames from 'classnames/bind'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Add from 'assets/icons/+.svg'
import { useAuth } from 'context/AuthProvider'
import { usePreview } from 'context/PreviewProvider'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
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
  const { t } = useTranslation('translation')
  const isCreateScratchSkill = forSkills && fromScratch
  const cx = classNames.bind(s)
  const { createVaClick } = useGaAssistant()
  const { addSkillButtonClick } = useGaSkills()

  const handleClick = () => {
    const isCreateScratchAssistant = !forSkills
    const isAddPublicSkill = forSkills && !fromScratch && !isPreview
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
              msg: <Trans i18nKey='modals.sign_in.build' />,
            }
          : {}
      )
    if (isAddPublicSkill) {
      addSkillButtonClick('skill_block_button')
      return trigger('SkillsListModal', {})
    }
    if (isCreateScratchSkill) {
      return trigger('SkillModal', { action: 'create' })
    }
    if (isCreateScratchAssistant) {
      createVaClick('va_templates_block')
      return trigger('AssistantModal', scratchAssistant)
    }
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
            <p>
              {text ??
                (isCreateScratchSkill
                  ? t('skill_table.create_from_scratch_btn')
                  : t('assistant_table.create_from_scratch_btn'))}
            </p>
          </button>
        </td>
      </tr>
    </tbody>
  )
}
