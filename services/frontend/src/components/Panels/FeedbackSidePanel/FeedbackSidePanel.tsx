import { useUIOptions } from 'context'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import { IFeedback, TLocale } from 'types/types'
import useTabsManager from 'hooks/useTabsManager'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { Accordion } from 'components/Dropdowns'
import { FeedbackStatusMenu } from 'components/Menus'
import SidePanelHeader from '../SidePanelHeader/SidePanelHeader'
import s from './FeedbackSidePanel.module.scss'

interface IProps {
  feedback: IFeedback
}

const FeedbackSidePanel: FC<IProps> = ({ feedback }) => {
  const { setUIOption } = useUIOptions()
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'sidepanels.feedback',
  })

  const [tabsInfo] = useTabsManager({
    activeTabId: 'details',
    tabList: new Map([['details', { name: 'details!!!' }]]),
  })

  const dispatchTrigger = (isOpen: boolean) => {
    setUIOption({
      name: consts.ACTIVE_FEEDBACK_SP_ID,
      value: isOpen ? feedback.id : null,
    })
    setUIOption({
      name: consts.GALLERY_PICTURES,
      value: isOpen ? feedback.pictures : [],
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [feedback])

  useEffect(() => {
    !feedback.pictures.length && tabsInfo.handleTabSelect('details')
  }, [feedback.pictures.length])

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          <li
            onClick={() => {
              tabsInfo.handleTabSelect('details')
            }}
            role='tab'
            aria-selected={tabsInfo.activeTabId === 'details'}
          >
            {t('details')}
          </li>
          <li
            onClick={() => {
              !!feedback.pictures.length &&
                tabsInfo.handleTabSelect('screenshots')
            }}
            role='tab'
            aria-selected={tabsInfo.activeTabId === 'screenshots'}
            data-disabled={!feedback.pictures.length}
          >
            {t('screenshots')}
          </li>
        </ul>
      </SidePanelHeader>

      {tabsInfo.activeTabId === 'details' && (
        <div className={s.container}>
          <div className={s.string}>
            <b>{t('author')}: </b>
            <span>{feedback?.email}</span>
          </div>

          <div className={s.string}>
            <b>{t('type')}: </b>
            <span>{feedback.type.name}</span>
          </div>

          <div className={s.string}>
            <b>{t('status')}: </b>
            <div>
              <FeedbackStatusMenu feedback={feedback} />
            </div>
          </div>

          <div className={s.string}>
            <b>{t('date')}: </b>
            <div className={s.date}>
              <CalendarIcon />
              {dateToUTC(feedback?.date_created, i18n.language as TLocale)}
            </div>
          </div>

          <Accordion title={t('text')} rounded isActive>
            <p className={s.text}>{feedback?.text}</p>
          </Accordion>
        </div>
      )}
      {tabsInfo.activeTabId === 'screenshots' && (
        <div className={s.pictures}>
          {feedback.pictures.map(({ id, picture }, i) => {
            return (
              <div
                onClick={() => {
                  setUIOption({
                    name: consts.GALLERY_STATE,
                    value: { isOpen: true, pictureIndex: i },
                  })
                }}
                className={s.picture}
                key={id}
              >
                <div className={s.shadow}></div>
                <img className={s.img} src={picture} alt='' />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default FeedbackSidePanel
