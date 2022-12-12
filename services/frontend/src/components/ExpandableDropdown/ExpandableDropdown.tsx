import { useState } from 'react'
import s from './ExpandableDropdown.module.scss'

const ExpandableDropdownn = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`${s.expandableDropdown} ${
        isOpen && s.expandableDropdown_active
      }`}>
      {!isOpen && (
        <button
          className={s.expandableDropdown__btn}
          onClick={() => setIsOpen(true)}>
          Instruction (click to expand)
        </button>
      )}
      {isOpen && (
        <div className={s.expandableDropdown__content}>
          <span onClick={() => setIsOpen(false)}>Instruction</span>
          <p>raw texts regular</p>
          <p>
            expressions (which will be preprocessed to separate examples before
            training) using the following features: () to determine the
            considered sequence, (bla|blabla) - vertical line to determine or
            symbol {'(){(0, 1)}'} to determine either precesence or absence of
            the given in the brackets.
          </p>
          <p>
            For example, from the regular expression{' '}
            {'(hi! |hello! ){0,1}how are you?'} two examples will be generated:
            hi! how are you? and hello! how are you?
          </p>
          <p>
            You also may insert several examples (both texts or regular
            expressions) at once splitting them by a new line.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExpandableDropdownn
