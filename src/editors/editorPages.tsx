import React, { useMemo } from 'react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { RiMarkPenLine } from 'react-icons/ri'
import { BiUserVoice } from 'react-icons/bi'

import PipelineIcon from './icons/pipelineIcon.svg'
import SelectorIcon from './icons/selectorIcon.svg'

import { useAppSelector } from '../storeHooks'
import type { RootState } from '../store'

export interface EditorPage {
  name: string;
  Icon: React.ComponentType<{iconSize: string}>;
  /* editor: React.ComponentType; */
  subpages?: EditorPage[];
}

export interface EditorsState {
  pages: EditorPage[];
  currentPage: string;
}

const builtinPages: EditorPage[] = [
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
  },
]

const initialState: EditorsState = {
  pages: builtinPages,
  currentPage: builtinPages[0].name
}

export const editorPagesSlice = createSlice({
  name: 'editorPages',
  initialState,
  reducers: {
    openEditorPage(state: EditorsState, action: PayloadAction<string>) {
      state.currentPage = action.payload
    }
  }
})

export const { openEditorPage } = editorPagesSlice.actions
export const editorPagesReducer = editorPagesSlice.reducer

export const usePages = () => useAppSelector(({ editorPages }: RootState) => editorPages.pages)
export const useCurrentPage = (): string => {
  const curPageName = useAppSelector(({ editorPages }: RootState) => editorPages.currentPage)
  const pages = usePages()
  return useMemo(() => {
    let toSearch: EditorPage[] = [...pages]
    while (toSearch.length > 0) {
      const page = toSearch.pop() as EditorPage
      if (page.name === curPageName) return page.name
      if (page.subpages && page.subpages.length > 0) toSearch = toSearch.concat(page.subpages)
    }
    
    throw new Error('Invalid page ' + curPageName)
  }, [curPageName])
}

