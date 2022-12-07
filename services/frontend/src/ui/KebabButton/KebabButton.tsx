import { useTooltip } from '../../hooks/useTooltip'
import Button from '../Button/Button'
import s from './KebabButton.module.scss'

export const KebabButton = ({ type, color, wrapper}: any) => {
  return wrapper ? (
    <Button theme='secondary' small={true}>
      <div style={{ flexDirection: `${type}` }} className={s.kebab}>
        <figure className={s.dots} />
        <figure className={s.dots} />
        <figure className={s.dots} />
      </div>
    </Button>
  ) : (
    <button style={{ flexDirection: `${type}` }} className={s.kebab}>
      <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
      <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
      <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
    </button>
  )
}
