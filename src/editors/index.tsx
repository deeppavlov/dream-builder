import React from 'react'

import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { RiMarkPenLine } from 'react-icons/ri'
import { BiUserVoice } from 'react-icons/bi'

import PipelineIcon from './icons/pipelineIcon.svg'
import SelectorIcon from './icons/selectorIcon.svg'

export interface EditorType {
  name: string
  Icon: React.ComponentType<{iconSize: string}>;
  /* Editor: React.ComponentType; */
}

const editors: EditorType[] = [
  {
    name: 'Discourse',
    Icon: ({ iconSize }) => <IoChatbubblesOutline size={iconSize}/>
  },
  {
    name: 'Intents',
    Icon: ({ iconSize }) => <BiUserVoice size={iconSize}/> 
  },
  {
    name: 'Pipeline',
    Icon: ({ iconSize }) => <PipelineIcon style={{ width: iconSize, height: iconSize }}/>
  },
  {
    name: 'Skills',
    Icon: ({ iconSize }) => <HiOutlineLightBulb size={iconSize}/>
  },
  {
    name: 'Response Selector',
    Icon: ({ iconSize }) => <SelectorIcon style={{ width: iconSize, height: iconSize }}/> 
  },
  {
    name: 'Annotators',
    Icon: ({ iconSize }) => <RiMarkPenLine size={iconSize} style={{ transform: 'scale(0.9)' }}/>
  }
]

export const getEditorType = (edName: string) => editors.find(({ name }) => name === edName) as EditorType

export default editors
