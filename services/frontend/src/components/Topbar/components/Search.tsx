import s from './Search.module.scss'

export const Search = () => {
  return (
    <div className={s.search}>
      <i className={s.loupe} />
      <input placeholder='Search' type='text' />
    </div>
  )
}
