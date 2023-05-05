import { FC } from 'react'
import Button from '../../../ui/Button/Button'
import s from '../DialogSidePanel.module.scss'

interface Props {
  handleDeploy: () => void
  deploy: any //FIX
}

export const StartDeploy: FC<Props> = ({ handleDeploy, deploy }) => {
  return (
    <div className={s.deployPanel}>
      <div className={s.text}>
        <h5 className={s.notification}>Chat with AI Assistant</h5>
        <p className={s.annotation}>
          In order to start chat with AI Assistant, it is necessary to build it
        </p>
      </div>
      <Button
        theme='primary'
        props={{ onClick: handleDeploy, disabled: deploy?.isLoading }}
      >
        Build Assistant
      </Button>
    </div>
  )
}
