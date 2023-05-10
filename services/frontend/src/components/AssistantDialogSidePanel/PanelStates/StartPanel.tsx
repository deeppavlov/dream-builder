import { FC } from 'react'
import TextLoader from '../../TextLoader/TextLoader'
import s from '.././DialogSidePanel.module.scss'

interface Props {
  handleStart: () => void
  renew: any //FIX
}

export const StartPanel: FC<Props> = ({ handleStart, renew }) => {
    
  return (
    <>
      <span className={s.alertName}>Run your bot</span>
      <p className={s.alertDesc}>Start a test to interact with your bot</p>
      <button className={s.runTest} onClick={handleStart}>
        {renew.isLoading ? <TextLoader /> : 'Run Test'}
      </button>
    </>
  )
}
