import classNames from 'classnames/bind'
import { IStackElement, StackType } from '../../types/types'
import { isSelector } from '../../utils/isSelector'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Kebab } from '../../ui/Kebab/Kebab'
import { Accordion } from '../../ui/Accordion/Accordion'
import { StackElement } from './StackElement'
import { WaitForNextRelease } from './WaitForNextRelease'
import s from './Stack.module.scss'

interface StackProps {
  type: StackType
  list: IStackElement[]
  disabled?: boolean
}

export const Stack: React.FC<StackProps> = ({
  type,
  list,
  disabled = false,
}) => {
  const customizable = list.filter(({ is_customizable }) => is_customizable)
  const nonCustomizable = list.filter(({ is_customizable }) => !is_customizable)
  let cx = classNames.bind(s)

  return (
    <div className={cx('stack', type)}>
      <div className={s.header}>
        <div className={s.title}>
          <img className={s.icon} src={`./src/assets/icons/${type}.svg`} />
          <p className={s.type}>{capitalizeTitle(type)}</p>
        </div>
        {/* {!isSelector(type) && (
            <Kebab disabled={type !== 'skills'} dataFor='' />
          )} */}
        {/* <div className={s.bottom}>
          {!isSelector(type) && (
            <p className={s.data}>{'_.__ GB RAM | _.__ GB GPU'}</p>
          )}
        </div> */}
      </div>
      <AddButtonStack
        disabled={disabled}
        text={`Add ${capitalizeTitle(type)}`}
      />
      <Accordion title='Customizable'>
        {customizable.length > 0 ? (
          customizable.map((item, i) => (
            <StackElement key={item.name + i} item={item} type={type} />
          ))
        ) : (
          <WaitForNextRelease />
        )}
      </Accordion>
      <Accordion isActive title='Non-customizable'>
        {nonCustomizable.map((item, i) => (
          <StackElement key={item.name + i} item={item} type={type} />
        ))}
      </Accordion>
    </div>
  )
}
