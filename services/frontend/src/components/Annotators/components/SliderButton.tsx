import s from './SliderButton.module.scss'

export const SliderButton = ({ sliderHandler }: any) => {
  return (
    <label className={s.switch}>
      <input onClick={sliderHandler} type='checkbox' />
      <span className={s.slider}></span>
    </label>
  )
}
