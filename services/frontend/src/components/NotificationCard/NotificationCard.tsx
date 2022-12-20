import { ReactComponent as AnnotatorNNBased } from '@assets/icons/annotator_nn_based.svg'
import { ReactComponent as SkillScript } from '@assets/icons/skill_script.svg'
import { ReactComponent as ArrowRight } from '@assets/icons/arrow_right_link.svg'
import SmallTag from '../SmallTag/SmallTag'
import s from './NotificationCard.module.scss'

export interface NotificationCardProps {
  topic: string
  type: 'skill' | 'annotator'
  about: string
  status: 'success' | 'training' | 'error'
  statusCount?: number
}

const NotificationCard = ({
  topic,
  type,
  about,
  status,
  statusCount,
}: NotificationCardProps) => {
  const getTagTheme = () => (status === 'training' ? 'default' : status)
  return (
    <div
      className={`${s.notificationCard} ${
        s[`notificationCard_status_${status}`]
      }`}>
      <div className={s.notificationCard__header}>
        <div className={s.notificationCard__topic}>
          <span className={s['notificationCard__topic-name']}>{topic}</span>
          <button className={s['notificationCard__more-btn']}>
            <ArrowRight />
          </button>
        </div>

        <span className={s['notificationCard__status-tag']}>
          {statusCount && 'Score:'}
          <SmallTag theme={getTagTheme()} isLoading={status === 'training'}>
            {statusCount ? statusCount : status}
            {/* {status === 'training' && '...'} */}
          </SmallTag>
        </span>
      </div>
      <div className={s.notificationCard__about}>
        {type === 'annotator' && <AnnotatorNNBased />}
        {type === 'skill' && <SkillScript />}
        <span>{about}</span>
      </div>
    </div>
  )
}

export default NotificationCard
