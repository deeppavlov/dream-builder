import React, { useState } from 'react'

type ActiveTabId = string
type TabList = Map<string, { name: string; disabled?: boolean }>

interface TabsInfo {
  activeTabId?: ActiveTabId
  tabList: TabList
}

export interface useTabsResult {
  activeTabId: ActiveTabId
  tabs: TabList
  setActiveTabId: (id: string) => void
  handleTabSelect: (id: string) => void
}

const useTabsManager = (
  info: TabsInfo
): [info: useTabsResult, setInfo: (info: TabsInfo) => void] => {
  const getValidActiveId = (id: ActiveTabId | undefined, tabs: TabList) =>
    id !== undefined ? id : tabs.keys().next().value

  const [tabs, setTabs] = useState<TabList>(info.tabList)
  const [activeTabId, setActiveTabId] = useState<ActiveTabId>(
    getValidActiveId(info.activeTabId, info.tabList)
  )

  const updateContentInfo = (info: TabsInfo) => {
    setTabs(info.tabList)
    setActiveTabId(getValidActiveId(info.activeTabId, info.tabList))
  }

  const handleTabSelect = (id: ActiveTabId) => {
    const isDisabled = tabs.get(id)?.disabled
    if (isDisabled) return
    setActiveTabId(id)
  }

  return [
    {
      activeTabId,
      tabs,
      setActiveTabId,
      handleTabSelect,
    },
    updateContentInfo,
  ]
}

export default useTabsManager
