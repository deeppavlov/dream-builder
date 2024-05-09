import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Arrow } from 'assets/icons/arrow_down.svg'
import { IFeedback } from 'types/types'
import { useAdmin } from 'hooks/api'
import { consts } from 'utils/consts'
import { FeedbackListItem } from '../FeedbackListItem/FeedbackListItem'
import s from './FeedbackList.module.scss'

interface ISortingRule {
  parameter: 'email' | 'date' | 'status' | 'type'
  isAscending: boolean
}

export const FeedbackList = () => {
  const cx = classNames.bind(s)
  const { t } = useTranslation('translation', {
    // keyPrefix: 'admin_page.user_list',
  })
  const { getFeedbackList } = useAdmin()
  const { data: feedbackList } = getFeedbackList()

  const [sortedFeedbackList, setSortedFeedbackList] = useState<IFeedback[]>([])
  const [sortingRule, setSortingRule] = useState<ISortingRule>({
    parameter: 'date',
    isAscending: true,
  })

  const sortFeedback = () => []

  useEffect(() => {
    const sortedFeedback = feedbackList || []
    // ? sortFeedback() : []
    setSortedFeedbackList(sortedFeedback)
  }, [feedbackList, sortingRule])

  const changeSortingRule = (
    parameter: 'email' | 'date' | 'status' | 'type'
  ) => {
    if (sortingRule.parameter === parameter) {
      setSortingRule(prev => ({ ...prev, isAscending: !prev.isAscending }))
    } else {
      setSortingRule({ parameter, isAscending: true })
    }
  }

  const { UIOptions } = useUIOptions()
  const isSidePanel = UIOptions[consts.RIGHT_SP_IS_ACTIVE]

  return (
    <div className={cx('container', isSidePanel && 'withSidePanel')}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>text</th>
            <th>
              <div
                className={s.sortableHeader}
                onClick={() => changeSortingRule('date')}
              >
                date
                {sortingRule.parameter === 'date' && (
                  <Arrow
                    className={cx('arrow', !sortingRule.isAscending && 'up')}
                  />
                )}
              </div>
            </th>
            <th>
              <div
                className={s.sortableHeader}
                onClick={() => changeSortingRule('type')}
              >
                type
                {sortingRule.parameter === 'type' && (
                  <Arrow
                    className={cx('arrow', !sortingRule.isAscending && 'up')}
                  />
                )}
              </div>
            </th>
            <th>
              <div
                className={s.sortableHeader}
                onClick={() => changeSortingRule('status')}
              >
                status
                {sortingRule.parameter === 'type' && (
                  <Arrow
                    className={cx('status', !sortingRule.isAscending && 'up')}
                  />
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFeedbackList.map(fb => (
            <FeedbackListItem key={fb.id} item={fb} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
