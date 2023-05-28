import { ReactComponent as FilterIcon } from '@assets/icons/filter.svg'
import { ReactComponent as LoupeIcon } from '@assets/icons/loupe.svg'
import { useState } from 'react'
import { Input } from 'components/Inputs'
import s from './Search.module.scss'

interface SearchProps {
  placeholder?: string
  filters?: boolean
}

const Search = ({ placeholder, filters }: SearchProps) => {
  const [value, setValue] = useState('')
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setValue('')
  }
  return (
    <div className={s.search}>
      <button className={s['search__loupe-btn']}>
        <LoupeIcon className={s.search__icon} />
      </button>
      <Input props={{ placeholder: placeholder ?? 'Search' }} />
      <button className={s['search__filter-btn']}>
        <FilterIcon className={s.search__icon} />
      </button>
    </div>
  )
}

export default Search
