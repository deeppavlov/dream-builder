import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IFeedback, TLocale } from 'types/types'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import s from './FeedbackListItem.module.scss'

interface IProps {
  item: IFeedback
}

export const FeedbackListItem: FC<IProps> = ({ item }) => {
  const { i18n, t } = useTranslation()
  const cx = classNames.bind(s)
  const { UIOptions } = useUIOptions()

  // const handleClick = () => {
  //   trigger(TRIGGER_RIGHT_SP_EVENT, {
  //     isOpen: !sidePanelIsOpen,
  //     children: <UserSidePanel user={user} />,
  //   })
  // }

  // useEffect(() => {
  //   trigger(TRIGGER_RIGHT_SP_EVENT, {
  //     isOpen: sidePanelIsOpen,
  //     children: <UserSidePanel user={user} />,
  //   })
  // }, [user])

  // const sidePanelIsOpen = UIOptions[consts.ACTIVE_USER_SP_ID] === user.id
  return (
    <tr className={s.item}>
      {/* <td className={s.email}>{item.email}</td> */}
      <td className={s.text}>{item.text}</td>
      <td className={s.date}>
        {dateToUTC(item.date_created, i18n.language as TLocale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </td>
      <td>{item.type.name}</td>
      <td className={cx('status', item.status.name.toLowerCase())}>
        {item.status.name}
      </td>
    </tr>
  )
}
