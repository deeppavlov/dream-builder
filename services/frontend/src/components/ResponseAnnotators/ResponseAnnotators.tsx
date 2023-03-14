import { FC } from 'react'
import ResponseAnnotatorsLogo from '../../assets/icons/response_annotators.svg'
import { Component } from '../../types/types'
import { AnnotatorElement } from '../Stack/AnnotatorElement'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import { usePreview } from '../../Context/PreviewProvider'
import s from './ResponseAnnotators.module.scss'

interface Props {
  responseAnnotators: Component[]
}

export const ResponseAnnotators: FC<Props> = ({ responseAnnotators }) => {
  const { isPreview } = usePreview()
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
            </div>
            <div className={s.bottom}></div>
          </div>
          <div className={s.body}></div>
          <AddButtonStack disabled={true} text='Add Response Annotators' />
          <div className={s.elements}>
            <Accordion title='Customizable'>
              <WaitForNextRelease />
              {responseAnnotators?.map((annotator, i) => {
                if (annotator.is_customizable) {
                  return (
                    <AnnotatorElement
                      key={annotator.name + i}
                      annotator={annotator}
                      isPreview={isPreview}
                    />
                  )
                }
              })}
            </Accordion>
            <Accordion title='Non-customizable'>
              {responseAnnotators?.map((annotator, i) => {
                if (!annotator.is_customizable) {
                  return (
                    <AnnotatorElement
                      key={annotator.name + i}
                      annotator={annotator}
                      isPreview={isPreview}
                    />
                  )
                }
              })}
            </Accordion>
          </div>
        </div>
      )}
    </>
  )
}
