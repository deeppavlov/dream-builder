import { Link } from 'react-router-dom'
import s from './Home.module.scss'

export const Home = () => {
  return (
    <>
      <div className={s.home}>
        <div className={s.left}>
          <h6>Build your bot as you used to play lego</h6>
          <div className={s.info}>
            <h2>
              The Global Bots
              <br /> Platform Place
            </h2>
            <p>
              The Easiest Way to Create Virtual Assistant <br /> and Your Own
              Bot
            </p>
            <div className={s.btns}>
              <Link to='/start'>
                <button className={s.db}>Start Building</button>
              </Link>
              <button className={s.watch}>
                <span>Watch Demo</span>
                <span className={s.icon} />
              </button>
            </div>
          </div>
        </div>
        <div className={s.right}>
          <div className={s.circle}></div>
        </div>
      </div>
    </>
  )
}
