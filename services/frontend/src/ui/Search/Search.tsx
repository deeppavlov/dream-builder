import { useState } from 'react'
import s from './Search.module.scss'

export const Search = () => {
  const [value, setValue] = useState('')
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setValue('')
  }
  return (
    <form onSubmit={handleSubmit} className={s.search}>
      <i className={s.loupe} />
      <input
        placeholder='Search'
        type='text'
        onChange={event => setValue(event.target.value)}
        value={value}
      />
    </form>
  )
}
