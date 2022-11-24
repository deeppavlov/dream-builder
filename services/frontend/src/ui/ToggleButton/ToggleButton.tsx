import s from './ToggleButton.module.scss'

export const ToggleButton = ({ sliderHandler }: any) => {
  return (
    <label className={s.switch}>
      <input onClick={sliderHandler} type='checkbox' />
      <span className={s.slider}></span>
    </label>
  )
}
