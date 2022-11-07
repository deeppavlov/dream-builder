import { Topbar } from '../components/Topbar/Topbar'
import s from '../styles/Error.module.scss'

export const ErrorPage = () => {
  return (
    <div className={s.nfp}>
      <Topbar />
      <p className={s.text}>
        Oops..
        <br />
        something went wrong
      </p>
      <div className={s.container}>
        <div className={s.bg}>
          <div className={s.light}></div>
        </div>
        <div className={s.ufo}>
          <div className={s.ufo_bottom}></div>
          <div className={s.ufo_top}></div>
          <div className={s.ufo_glass}>
            <div className={s.alien}>
              <div className={s.alien_eye}></div>
            </div>
          </div>
        </div>
        <div className={s.bed}>
          <div className={s.mattress}></div>
        </div>
        <div className={s.man}>
          <div className={s.man_body}></div>
        </div>
      </div>
    </div>
  )
}
