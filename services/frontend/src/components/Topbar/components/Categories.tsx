import s from './Categories.module.scss'

export const Categories = () => {
  return (
    <div className={s.dropdown}>
      <i className={s.arrow} />
      <input
        disabled={true}
        className={s.categories}
        type='Text'
        placeholder='All Categories'
      />
    </div>
  )
}
