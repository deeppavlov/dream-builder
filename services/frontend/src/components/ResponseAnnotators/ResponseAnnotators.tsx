import ResponseAnnotatorsLogo from '../../assets/icons/response_annotators.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import s from './ResponseAnnotators.module.scss'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Annotator } from '../Annotators/Annotators'
import { countResources } from '../../utils/countResources'

interface Props {
  responseAnnotators: [Annotator]
}

export const ResponseAnnotators: React.FC<Props> = ({ responseAnnotators }) => {
  return (
    <>
      {responseAnnotators && (
        <div className={s.stack}>
          <div className={s.header}>
            <div className={s.top}>
              <div className={s.title}>
                <img src={ResponseAnnotatorsLogo} className={s.icon} />
                <p className={s.type}>Response Annotators</p>
              </div>
              <Kebab disabled dataFor='response_annotators' />
            </div>
            <div className={s.bottom}>
              <p className={s.data}>
                {(responseAnnotators &&
                  countResources(responseAnnotators, 'ram_usage') +
                    ' | ' +
                    countResources(responseAnnotators, 'gpu_usage')) ||
                  '0.00 GB RAM | 0.00 GB GPU'}
              </p>
            </div>
          </div>
          <div className={s.body}></div>
          <AddButtonStack disabled={true} text='Add Candidate Annotators' />
          <div className={s.elements}>
            <Accordion title='Customizable'></Accordion>
            <Accordion title='Non-customizable'>
              {responseAnnotators?.map((item: Annotator, i: number) => {
                return (
                  <Element
                    key={i}
                    title={capitalizeTitle(item.display_name)}
                    item={item}
                  />
                )
              })}
            </Accordion>
          </div>
        </div>
      )}
    </>
  )
}
