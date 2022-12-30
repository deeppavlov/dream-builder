import { useState } from 'react'
import { Container } from '../ui/Container/Container'
import { Main } from '../components/Main/Main'
import { SkillCard } from '../components/SkillCard/SkillCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../ui/Table/Table'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { useQuery } from 'react-query'
import { getSkillList } from '../services/getSkillsList'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import { CreateSkillModal } from '../components/CreateSkillModal/CreateSkillModal'
import { useAuth } from '../services/AuthProvider'
import { SkillType } from '../types/types'

interface skill_list {
  assistant_dist: string
  name: string
  metadata: {
    execution_time: any
    date_created: string | number | Date
    author: string
    type: SkillType
    description: string
    version: string
    ram_usage: string
    gpu_usage: string
    time: string
    display_name: string
  }
}

export const SkillsAllPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    console.log(listView)
  }
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery('skills_list', getSkillList)

  if (isSkillsLoading) return 'Loading...'

  if (skillsError) return 'An error has occurred: '
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <Wrapper title='Public Skills' amount={skillsData.length}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(280px, 1fr))'>
              {skillsData?.map((skill: skill_list, i: number) => {
                const date = dateToUTC(skill.metadata.date_created)
                return (
                  <SkillCard
                    key={i}
                    type='public'
                    name={skill.metadata.display_name}
                    botName={skill.assistant_dist}
                    skillType={skill.metadata.type}
                    dateCreated={date}
                    desc={skill.metadata.description}
                    version={skill.metadata.version}
                    ram={skill.metadata.ram_usage}
                    gpu={skill.metadata.gpu_usage}
                    time={skill.metadata.execution_time}
                    executionTime={skill.metadata.execution_time}
                    big
                    disabledMsg={
                      auth?.user
                        ? undefined
                        : 'You must be signed in to add the skill'
                    }
                  />
                )
              })}
            </Container>
          </Wrapper>
        ) : (
          <Wrapper title='Public Skills' amount={skillsData.length}>
            <Table>
              {skillsData?.map((skill: skill_list, i: number) => {
                const date = dateToUTC(skill.metadata.date_created)
                const time = timeToUTC(skill.metadata.date_created)
                return (
                  <SkillListItem
                    key={i}
                    name={skill.metadata.display_name}
                    botName={skill.assistant_dist}
                    dateCreated={date}
                    time={time}
                    desc={skill.metadata.description}
                    version={skill.metadata.version}
                    ram={skill.metadata.ram_usage}
                    gpu={skill.metadata.gpu_usage}
                    executionTime={skill.metadata.execution_time}
                    skillType={skill.metadata.type}
                    disabledMsg={
                      auth?.user
                        ? undefined
                        : 'You must be signed in to add the skill'
                    }
                  />
                )
              })}
            </Table>
          </Wrapper>
        )}
        <SkillSidePanel
          disabledMsg={
            auth?.user ? undefined : 'You must be signed in to add the skill'
          }
          position={{ top: 64 }}
        />
        <CreateSkillModal />
      </Main>
    </>
  )
}
