import classNames from 'classnames/bind'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Kebab } from '../../ui/Kebab/Kebab'
import { Accordion } from '../../ui/Accordion/Accordion'
import { StackElement } from './StackElement'
import s from './Stack.module.scss'

type StackType =
  | 'annotators'
  | 'candidate_annotators'
  | 'response_annotators'
  | 'response_selectors'
  | 'skill_selectors'
  | 'skills'

interface StackProps {
  items?: Array<object>
  type: StackType
  disableButton?: boolean
  data: object
  resources: string
}

export const Stack: React.FC<StackProps> = ({
  type,
  items,
  disableButton,
  data,
  resources,
}) => {
  let cx = classNames.bind(s)
  console.log(type)
  return (
    type && (
      <div className={cx('stack', type)}>
        <div className={cx('header', type)}>
          <div className={s.top}>
            <div className={s.title}>
              <img className={s.icon} src={`./src/assets/icons/${type}.svg`} />
              <p className={s.type}>{capitalizeTitle(type)}</p>
            </div>
            <Kebab disabled dataFor='all_annotators' />
            {/* need to fix tooltip */}
          </div>
          <div className={s.bottom}>
            {type !== 'skill_selectors' && type !== 'response_selectors' && (
              <p className={s.data}>
                {resources || '_.__ GB RAM | _.__ GB GPU'}
              </p>
            )}
          </div>
        </div>
        {type !== 'response_selectors' && (
          <AddButtonStack
            disabled={type != 'skills' }
            text={`Add ${capitalizeTitle(type)}`}
          />
        )}
        <div className={s.elements}>
          <Accordion title='Customizable'></Accordion>
          <Accordion title='Non-customizable'>
            {data?.map((item: string, id: number) => {
              return <StackElement key={id} item={item} params='' type='' />
            })}
          </Accordion>
        </div>
      </div>
    )
  )
}
