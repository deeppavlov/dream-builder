import { useState } from 'react'
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Container } from '../ui/Container/Container'
import { AddButton } from '../ui/AddButton/AddButton'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Annotators } from '../components/Annotators/Annotators'
import { Skills } from '../components/Skills/Skills'
import { CandidateAnnotators } from '../components/CandidateAnnotators/CandidateAnnotators'
import { SkillSelector } from '../components/SkillSelector/SkillSelector'
import { BotTab } from '../components/Sidebar/components/BotTab'
import { TestTab } from '../components/Sidebar/components/TestTab'
import { SkillsTab } from '../components/Sidebar/components/SkillsTab'
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { ResponseSelector } from '../components/ResponseSelector/ResponseSelector'
import { ResponseAnnotators } from '../components/ResponseAnnotators/ResponseAnnotators'
import { TestTabWindow } from '../components/TestTabWindow/TestTabWindow'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDistByName } from '../services/getDistByName'
import { getSkillListByDistName } from '../services/getSkillListByDistName'
import { useAuth } from '../services/AuthProvider'
import { dateToUTC } from '../utils/dateToUTC'
import { capitalizeTitle } from '../utils/capitalizeTitle'
import { getComponentsFromAssistantDists } from '../services/getComponentsFromAssistantDists'
import { Stack } from '../components/Stack/Stack'

export const EditorPage = () => {
  const auth = useAuth()
  const data = useParams()

  const {
    isLoading: isDistsComponentsLoading,
    error: distsComponentsError,
    data: distsComponentsData,
  } = useQuery(
    ['distsComponents', data.name],
    () => getComponentsFromAssistantDists(data.name!),
    {
      enabled: data.name?.length! > 0,
    }
  )
  const {
    isLoading: isSkillListLoading,
    error: skillListError,
    data: skillListData,
  } = useQuery(
    ['skillList', data.name],
    () => getSkillListByDistName(data.name!),
    {
      enabled: data.name?.length! > 0,
    }
  )

  console.log(distsComponentsData)
  // distsComponentsData && console.log(Object.values(distsComponentsData))
  // distsComponentsData && console.log(Object.keys(distsComponentsData))
  // distsComponentsData && console.log(distsComponentsData.annotators)
  return (
    <>
      <Topbar type='editor' title={capitalizeTitle(data.name!)} />
      <Tabs>
        <Sidebar>
          <TabList>
            <Container
              width='100%'
              alignItems='center'
              flexDirection='column'
              gap='12px'
              overflow='hidden'>
              <Tab>
                <SkillsTab />
              </Tab>
              <Tab>
                <BotTab />
              </Tab>
            </Container>
          </TabList>
        </Sidebar>
        <TabPanel>
          <Main sidebar editor draggable>
            {isDistsComponentsLoading ? (
              <>{'Loading...'}</>
            ) : (
              <>
                {distsComponentsData &&
                  Object.keys(distsComponentsData).map(type => (
                    <Stack
                      type={type}
                      data={distsComponentsData[type]}
                      resources={''}
                    />
                  ))}
              </>
            )}
          </Main>
        </TabPanel>
        <TabPanel>
          <Main sidebar editor>
            <Wrapper
              title={`Skills in ${capitalizeTitle(data.name!)} distributive`}>
              <Container
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
                {skillListData?.map((skill: any) => {
                  const dateCreated = dateToUTC(skill.metadata.date_created)
                  return (
                    <SkillInBotCard
                      name={skill.metadata.display_name}
                      author={auth.user.name}
                      dateCreated={dateCreated}
                      desc={skill.metadata.description}
                      version={skill.metadata.version}
                      ram={skill.metadata.ram_usage}
                      gpu={skill.metadata.gpu_usage}
                      executionTime={skill.metadata.execution_time}
                      skillType={skill.metadata.type}
                    />
                  )
                })}
              </Container>
            </Wrapper>
          </Main>
        </TabPanel>
      </Tabs>
    </>
  )
}
