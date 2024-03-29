import classNames from 'classnames/bind'
import s from './CardsLoader.module.scss'

interface Props {
  cardsCount: number
  type?: 'bot' | 'skill'
}

const CardsLoader = ({ cardsCount, type }: Props) => {
  let cx = classNames.bind(s)
  const getSkeletons = (count: number) => {
    let array = []

    for (let i = 0; i < count; i++) {
      array.push(
        <div key={i} className={cx('card', type && type, 'skeleton')}>
          <div className={cx('header')}></div>
          <div className={s.body}>
            <div className={cx('desc')}></div>
            <div className={cx('desc')}></div>
            <div className={s.btns}>
              <div className={cx('btn')}></div>
              <div className={cx('small-btn')}></div>
            </div>
          </div>
        </div>
      )
    }

    return array
  }
  return <>{getSkeletons(cardsCount).map(el => el)}</>
}

export default CardsLoader
