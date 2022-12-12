import { useState } from 'react'
import Play from '../../../assets/icons/test.svg'
import DialogSidePanel from '../../DialogSidePanel/DialogSidePanel'
import s from './Test.module.scss'

export const Test = () => {
  const [modalIsOpen, setIsOpen] = useState(false)

  return (
    <button data-tip='Chat With Your Bot' className={s.test}>
      <img
        src={Play}
        alt='Play'
        className={s.test}
        onClick={() => setIsOpen(true)}
      />
      <DialogSidePanel
        isOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        positions={{ top: 64 }}
      />
    </button>
  )
}
