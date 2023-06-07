import { RotatingLines } from 'react-loader-spinner'
import s from '../DialogSidePanel.module.scss'

export const AwaitDeploy = () => {
  return (
    <div className={s.await}>
      <RotatingLines
        strokeColor='grey'
        strokeWidth='5'
        animationDuration='0.75'
        width='64'
        visible={true}
      />
      <p className={s.notification}>Please wait till assistant launching</p>
      <p className={s.notification}>This may take a few minutes.</p>
    </div>
  )
}
