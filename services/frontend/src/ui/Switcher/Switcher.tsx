import s from './Switcher.module.scss'

const Switcher = ({values}: any) => {
  return (
    <label className={`${s.switch} ${s['btn-color-mode-switch']}`}>
      <input type='checkbox' name='turn_mode' id='turn_mode' value={values[0]} />
      <label
        className={s['btn-color-mode-switch-inner']}
        htmlFor='turn_mode'
        data-on={values[0]}
        data-off={values[1]}></label>
    </label>
  )
}

export default Switcher
