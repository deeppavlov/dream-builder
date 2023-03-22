import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { trigger } from '../../utils/events'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'
import { IStackElement } from '../../types/types'
import { modelTypeMap } from '../../mapping/modelTypeMap'
import s from './AnnotatorSidePanel.module.scss'

interface Props {
  annotator: IStackElement
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const AnnotatorSidePanel = ({ annotator, children, activeTab }: Props) => {
  const { display_name, author, description, model_type } = annotator
  const isEditor = children !== undefined
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
  const nameForModelType = modelTypeMap[model_type ?? '']
  let cx = classNames.bind(s)

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
              <span className={cx('name')}>{display_name}</span>
              <EditPencilIcon className={cx('edit-pencil')} data-disabled />
            </div>
            <div className={cx('author')}>
              <img src={DeepPavlovLogo} alt='Author' />
              <span>{author}</span>
            </div>
            <ul className={cx('table')}>
              <li className={cx('table-item')}>
                <span className={cx('table-name')}>Component type:</span>
                <span className={cx('table-value', nameForModelType)}>
                  <img
                    className={s.typeLogo}
                    src={`./src/assets/icons/${
                      modelTypeMap[annotator?.model_type ?? '']
                    }.svg`}
                  />
                  <span>{model_type ?? 'Empty'}</span>
                </span>
              </li>
            </ul>
            <p className={cx('desc')}>{description}</p>
          </div>
        </div>
      )}

      {children && tabsInfo.activeTabId === 'Editor' && children}
    </>
  )
}

export default AnnotatorSidePanel
