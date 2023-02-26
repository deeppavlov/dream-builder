import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { ReactComponent as BookIcon } from '@assets/icons/book.svg'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { trigger } from '../../utils/events'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'
import { IAnnotator } from '../../types/types'
import s from './AnnotatorSidePanel.module.scss'
import { getStyleType } from '../../utils/getStyleType'

interface Props {
  annotator: IAnnotator
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const AnnotatorSidePanel = ({
  annotator: propAnnotator,
  children,
  activeTab,
}: Props) => {
  let cx = classNames.bind(s)
  const isEditor = children !== undefined
  const [annotator, setAnnotator] = useState(propAnnotator)
  const [properties, editor] = ['Properties', 'Editor']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: isEditor ? activeTab ?? properties : properties,
    tabList: new Map(
      isEditor
        ? [
            [properties, { name: properties }],
            [editor, { name: editor }],
          ]
        : [[properties, { name: properties }]]
    ),
  })

  const handleCloseSP = () => trigger(BASE_SP_EVENT, { isOpen: false })

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, tab]) => (
            <li
              role='tab'
              data-disabled={tab.disabled}
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              onClick={() => tabsInfo.handleTabSelect(id)}>
              {tab.name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      {tabsInfo.activeTabId === 'Properties' && (
        <div role='tabpanel'>
          <div className={s.properties}>
            <div className={cx('annotator-header')}>
              <span className={cx('name')}>{annotator.name}</span>
              <EditPencilIcon className={cx('edit-pencil')} data-disabled />
            </div>
            <div className={cx('author')}>
              <img src={annotator.authorImg} alt='Author' />
              <span>{annotator.author}</span>
            </div>
            <ul className={cx('table')}>
              <li className={cx('table-item')}>
                <span className={cx('table-name')}>Type:</span>
                <span
                  className={cx('table-value', getStyleType(annotator.type))}>
                  <BookIcon />
                  <span>{annotator.type}</span>
                </span>
              </li>
            </ul>
            <p className={cx('desc')}>{annotator.desc}</p>
          </div>
        </div>
      )}

      {children && tabsInfo.activeTabId === 'Editor' && children}
    </>
  )
}

export default AnnotatorSidePanel
