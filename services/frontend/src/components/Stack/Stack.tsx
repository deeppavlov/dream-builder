import classNames from 'classnames/bind'
import { StackType } from '../../types/types'
import { isSelector } from '../../utils/isSelector'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Kebab } from '../../ui/Kebab/Kebab'
import { Accordion } from '../../ui/Accordion/Accordion'
import { StackElement } from './StackElement'
import s from './Stack.module.scss'

interface StackProps {
  type: StackType
  data: Array<object>
}

export const Stack: React.FC<StackProps> = ({ type, data }) => {
  let cx = classNames.bind(s)

  return (
    type && (
      <div className={cx('stack', type)}>
        <div className={cx('header', type)}>
          <div className={s.top}>
            <div className={s.title}>
              <img className={s.icon} src={`./src/assets/icons/${type}.svg`} />
              <p className={s.type}>{capitalizeTitle(type)}</p>
            </div>
            {!isSelector(type) && (
              <Kebab disabled={type !== 'skills'} dataFor='' />
            )}
            {/* need to fix tooltip */}
          </div>
          <div className={s.bottom}>
            {!isSelector(type) && (
              <p className={s.data}>{'_.__ GB RAM | _.__ GB GPU'}</p>
            )}
          </div>
        </div>
        {type !== 'response_selectors' && (
          <AddButtonStack
            disabled={type != 'skills'}
            text={`Add ${capitalizeTitle(type)}`}
          />
        )}
        <div className={s.elements}>
          <Accordion closed title='Customizable'></Accordion>
          <Accordion title='Non-customizable'>
            {data?.map((item: object, id: number) => {
              return <StackElement key={id} item={item} type={type} />
            })}
          </Accordion>
        </div>
      </div>
    )
  )
}
