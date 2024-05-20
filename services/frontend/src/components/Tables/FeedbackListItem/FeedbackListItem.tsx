import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IFeedback, TLocale } from 'types/types'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { trigger } from 'utils/events'
import { FeedbackStatusMenu } from 'components/Menus'
import { FeedbackSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './FeedbackListItem.module.scss'

interface IProps {
  item: IFeedback
}

export const FeedbackListItem: FC<IProps> = ({ item }) => {
  const { i18n, t } = useTranslation()
  const cx = classNames.bind(s)
  const { UIOptions } = useUIOptions()

  const sidePanelIsOpen = UIOptions[consts.ACTIVE_FEEDBACK_SP_ID] === item.id

  const handleClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: !sidePanelIsOpen,
      children: <FeedbackSidePanel feedback={item} />,
    })
  }

  useEffect(() => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: sidePanelIsOpen,
      children: <FeedbackSidePanel feedback={item} />,
    })
  }, [item])

  const date = dateToUTC(item.date_created, i18n.language as TLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  // split the date into 2 lines
  const [first, second, ...rest] = date.split(' ')
  const firstString = [first, second].join(' ')
  const secondString = rest.join(' ')

  return (
    <tr className={s.item} onClick={handleClick}>
      <td className={s.text}>{item.text}</td>
      <td className={s.date}>
        <span className={s.dateString}>{firstString}</span>
        <br />
        <span className={s.dateString}>{secondString}</span>
      </td>
      <td>{t(`modals.feedback.types.${item.type.name}`)}</td>
      <td className={cx('status', item.status.name.toLowerCase())}>
        {<FeedbackStatusMenu feedback={item} />}
      </td>
    </tr>
  )
}
