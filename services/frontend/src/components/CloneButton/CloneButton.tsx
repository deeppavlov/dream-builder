import { FC } from 'react'
import classNames from 'classnames/bind'
import { usePreview } from '../../context/PreviewProvider'
import Button from '../../ui/Button/Button'
import { ReactComponent as CloneIcon } from '../../assets/icons/clone.svg'
import s from './CloneButton.module.scss'

interface Props {
  amount?: string | number
  handler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const CloneButton: FC<Props> = ({ amount, handler }) => {
  const { isPreview } = usePreview()
  let cx = classNames.bind(s)
  return (
    <div className={s.clone}>
      <Button
        theme={isPreview ? 'primary' : 'secondary'}
        small
        withIcon
        clone
        props={{ onClick: handler }}>
        <CloneIcon />
        <div className={s.container}>
          <span>Clone</span>
          {amount ?? (
            <div className={cx('circle', isPreview ? 'preview' : 'edit')}>
              {amount || '42'}
            </div>
          )}
        </div>
      </Button>
    </div>
  )
}
