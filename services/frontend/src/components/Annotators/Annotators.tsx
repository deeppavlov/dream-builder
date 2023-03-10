import AnnotatorsLogo from '../../assets/icons/annotators.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import { countResources } from '../../utils/countResources'
import { Annotator } from '../../types/types'
import s from './Annotators.module.scss'
import { usePreview } from '../../context/PreviewProvider'

interface Props {
  annotators: [Annotator]
}

export const Annotators: React.FC<Props> = ({ annotators }) => {
  const { isPreview } = usePreview()

  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={AnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Annotators</p>
          </div>
          {/* <Kebab disabled dataFor='all_annotators' /> */}
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {(annotators &&
              countResources(annotators, 'ram_usage') +
                ' | ' +
                countResources(annotators, 'gpu_usage')) ||
              '0.00 GB RAM | 0.00 GB GPU'}
          </p>
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'></Accordion>
        <Accordion title='Non-customizable'>
          {annotators?.map((item: Annotator, i: number) => {
            return (
              <Element
                key={i}
                annotator={item}
                isCustomizable={false}
                isPreview={isPreview}
              />
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
