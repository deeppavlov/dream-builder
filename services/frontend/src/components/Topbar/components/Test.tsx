import { useState } from 'react'
import Play from '../../../assets/icons/test.svg'
import { trigger } from '../../../utils/events'
import { BASE_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import DialogSidePanel from '../../DialogSidePanel/DialogSidePanel'
import s from './Test.module.scss'

export const Test = () => {
  return (
    <button
      data-tip='Chat With Your Bot'
      data-for='topbar_tooltip'
      className={s.test}>
      <img
        src={Play}
        alt='Play'
        className={s.test}
        onClick={() =>
          trigger(BASE_SP_EVENT, { children: <DialogSidePanel /> })
        }
      />
    </button>
  )
}
