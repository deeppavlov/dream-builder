import AnnotatorsLogo from '../../assets/icons/annotators.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import s from './Annotators.module.scss'

export const Annotators: React.FC = ({ annotatorsList }: any) => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={AnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Annotators</p>
          </div>
          <Kebab disabled dataFor='all_annotators' />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {annotatorsList?.recources || '0.00 GB RAM | 0.00 GB GPU'}
          </p>
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Annotators' />
      <div className={s.elements}>
        {/* <Accordion title='Customizable'></Accordion> */}
        <Accordion title='Non-customizable'>
          {annotatorsList?.map((item: string, i: number) => {
            return <Element key={i} title={capitalizeTitle(item)} />
          })}
        </Accordion>
      </div>
    </div>
  )
}
