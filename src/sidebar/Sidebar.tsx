import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'

import { useAppDispatch } from '../storeHooks'
import { openEditorPage, useCurrentPage, usePages } from '../editors/editorPages'
import logoImg from './logo.png'
import './Sidebar.css'

const ICON_SIZE = '40px'

export default function () {
  const [isOpen, setOpen] = useState(false)
  const pages = usePages()
  const currentPage = useCurrentPage()
  const dispatch = useAppDispatch()

  return (
    <>
      <div className={'Sidebar-logocont ' + (isOpen ? 'Sidebar-logocont-open' : '')} onClick={() => setOpen(!isOpen)}>
        <img className='Sidebar-logo' src={logoImg}/>
      </div>
      <div className='Sidebar-iconscont'>
        { pages.map(({ name, Icon }) => 
          <div
            key={name}
            className={(name === currentPage ? 'Sidebar-icon-sel' : '') + (isOpen ? ' Sidebar-icon-open' : '')}
            onClick={() => dispatch(openEditorPage(name))}
          >
            <Icon iconSize={ICON_SIZE}/>
          </div>
        ) }
      </div>
      <div className={'Sidebar ' + (isOpen ? 'Sidebar-open' : '')}>
        <div className='Sidebar-header'>
          <IoIosArrowBack size='60px' className='Sidebar-closebtn' onClick={() => setOpen(false)}/>
          <div className='Sidebar-headername'>Deepy 3000</div>
        </div>

        { isOpen && pages.map(({ name }) => 
          <div
            key={name}
            className={'Sidebar-pagelink ' + (name === currentPage ? 'Sidebar-pagelink-sel' : '')}
            onClick={() => dispatch(openEditorPage(name))}
          >
            { name }
          </div>
        ) }
      </div>
    </>
  )
}
