import classNames from 'classnames/bind'
import { FC, useId } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ArrowDown } from 'assets/icons/arrow_down_topbar.svg'
import { ReactComponent as Check } from 'assets/icons/checkbox_mark.svg'
import { IFeedback } from 'types/types'
import { toasts } from 'mapping/toasts'
import { useAdmin } from 'hooks/api'
import { trigger } from 'utils/events'
import { stopPropagation } from 'utils/stopPropagation'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import s from './FeedbackStatusMenu.module.scss'

interface IProps {
  feedback: IFeedback
}

const FeedbackStatusMenu: FC<IProps> = ({ feedback }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.feedback.statuses',
  })
  const cx = classNames.bind(s)
  const id = useId()
  const { getFeedbackStatuses, changeFeedbackStatus } = useAdmin()
  const feedbackStatuses = getFeedbackStatuses()

  const changeStatus = (id: number) => {
    toast.promise(
      changeFeedbackStatus.mutateAsync({
        feedbackId: feedback.id,
        statusId: id,
      }),
      toasts().changeFeedbackStatus
    )
  }

  return (
    <>
      <button
        className={s.status}
        data-tooltip-id={`status_${id}`}
        onClick={stopPropagation}
      >
        <span className={cx(feedback.status.name)}>
          {t(feedback.status.name)}
        </span>
        <ArrowDown className={s.svg} />
      </button>
      <BaseContextMenu
        className={s.contextMenu}
        tooltipId={`status_${id}`}
        place='bottom'
        noArrow
      >
        {feedbackStatuses.data?.map(({ name, id }) => {
          const isActive = name === feedback.status.name
          return (
            <div
              onClick={e => {
                e.stopPropagation()
                trigger('CtxMenuBtnClick', {})
                changeStatus(id)
              }}
              key={id}
              className={cx('contextMenuItem')}
            >
              {t(name)}
              <div className={s.check}>{isActive && <Check />}</div>
            </div>
          )
        })}
      </BaseContextMenu>
    </>
  )
}

export default FeedbackStatusMenu
