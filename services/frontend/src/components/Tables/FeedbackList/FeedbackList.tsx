import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RotatingLines } from 'react-loader-spinner'
import { ReactComponent as Arrow } from 'assets/icons/arrow_down.svg'
import { IFeedback } from 'types/types'
import { useAdmin } from 'hooks/api'
import { consts } from 'utils/consts'
import { sortFeedbackItems } from 'utils/sortFeedbackItems'
import { FeedbackListItem } from '../FeedbackListItem/FeedbackListItem'
import s from './FeedbackList.module.scss'

interface ISortingRule {
  parameter: 'date' | 'status' | 'type'
  isAscending: boolean
}

export const FeedbackList = () => {
  const cx = classNames.bind(s)
  const { t } = useTranslation('translation', {
    keyPrefix: 'admin_page.feedback_list',
  })
  const { getFeedbackList } = useAdmin()
  const { data: feedbackList, isLoading } = getFeedbackList()

  const [sortedFeedbackList, setSortedFeedbackList] = useState<IFeedback[]>([])
  const [sortingRule, setSortingRule] = useState<ISortingRule>({
    parameter: 'date',
    isAscending: true,
  })

  useEffect(() => {
    const sortedFeedback = feedbackList
      ? sortFeedbackItems(
          [...feedbackList],
          sortingRule.parameter,
          sortingRule.isAscending
        )
      : []
    setSortedFeedbackList(sortedFeedback)
  }, [feedbackList, sortingRule])

  const changeSortingRule = (parameter: 'date' | 'status' | 'type') => {
    if (sortingRule.parameter === parameter) {
      setSortingRule(prev => ({ ...prev, isAscending: !prev.isAscending }))
    } else {
      setSortingRule({ parameter, isAscending: true })
    }
  }

  const { UIOptions } = useUIOptions()
  const isSidePanel = UIOptions[consts.RIGHT_SP_IS_ACTIVE]

  return (
    <>
      <div className={cx('container', isSidePanel && 'withSidePanel')}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>{t('text')}</th>
              <th>
                <div
                  className={s.sortableHeader}
                  onClick={() => changeSortingRule('date')}
                >
                  {t('date')}
                  <div className={s.arrowContainer}>
                    {sortingRule.parameter === 'date' && (
                      <Arrow
                        className={cx(
                          'arrow',
                          !sortingRule.isAscending && 'up'
                        )}
                      />
                    )}
                  </div>
                </div>
              </th>
              <th>
                <div
                  className={s.sortableHeader}
                  onClick={() => changeSortingRule('type')}
                >
                  {t('type')}
                  <div className={s.arrowContainer}>
                    {sortingRule.parameter === 'type' && (
                      <Arrow
                        className={cx(
                          'arrow',
                          !sortingRule.isAscending && 'up'
                        )}
                      />
                    )}
                  </div>
                </div>
              </th>
              <th>
                <div
                  className={s.sortableHeader}
                  onClick={() => changeSortingRule('status')}
                >
                  {t('status')}
                  <div className={s.arrowContainer}>
                    {sortingRule.parameter === 'status' && (
                      <Arrow
                        className={cx(
                          'arrow',
                          !sortingRule.isAscending && 'up'
                        )}
                      />
                    )}
                  </div>
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
      {isLoading && (
        <div
          style={{
            alignSelf: 'center',
            justifySelf: 'center',
          }}
        >
          <RotatingLines
            strokeColor='grey'
            strokeWidth='5'
            animationDuration='0.75'
            width='64'
            visible={true}
          />
        </div>
      )}
    </>
  )
}
