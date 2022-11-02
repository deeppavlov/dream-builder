import s from './Filter.module.scss'

export const Filter = () => {
  return (
    <div className={s.dropdown}>
      <i className={s.arrow} />
      <input
        disabled={true}
        className={s.filter}
        type='Text'
        placeholder='Filter By'
      />
    </div>
  )
}
