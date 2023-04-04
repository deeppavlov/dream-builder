import classNames from 'classnames/bind'
import { FC } from 'react'
import Add from '../../assets/icons/+.svg'
import { useAuth } from '../../context/AuthProvider'
import { usePreview } from '../../context/PreviewProvider'
import { trigger } from '../../utils/events'
import s from './AddButton.module.scss'

interface Props {
  text?: string
  disabled?: boolean
  forTable?: boolean
  forGrid?: boolean
  forSkills?: boolean
  fromScratch?: boolean
}

export const AddButton: FC<Props> = ({
  text,
  disabled,
  forGrid,
  forTable,
  forSkills,
  fromScratch,
}) => {
  const cx = classNames.bind(s)
  const auth = useAuth()
  const { isPreview } = usePreview()

  const handleClick = () => {
    if (!auth?.user) {
      trigger('SignInModal', {})
      return
    }

    const addBot = () => {
      trigger('AssistantModal', { action: 'create' })
    }

    if (forSkills && !isPreview) trigger('SkillsListModal', {})
    fromScratch && trigger('SkillModal', { action: 'create' })
    if (!forSkills && !fromScratch) addBot()
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
      <tr className={cx('tr')}>
        <td colSpan={5} className={s.td}>
          <button className={s.forTable} onClick={handleClick}>
            <img src={Add} />
            <p>{text || 'Create From Scratch'}</p>
          </button>
        </td>
      </tr>
    </tbody>
  )
}
