import s from './SliderButton.module.scss'

export const SliderButton = () => {
  return (
    <label className={s.switch}>
      <input type='checkbox' />
      <span className={s.slider}></span>
    </label>
  )
}
