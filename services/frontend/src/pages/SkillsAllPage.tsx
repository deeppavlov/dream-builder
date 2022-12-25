import { useState } from 'react'
import { Container } from '../ui/Container/Container'
import { Main } from '../components/Main/Main'
import { SkillCard, skillType } from '../components/SkillCard/SkilllCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../ui/Table/Table'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { useQuery } from 'react-query'
import { getSkillList } from '../services/getSkillsList'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'

interface skill_list {
  name: string
  metadata: {
    execution_time: any
    date_created: string | number | Date
    author: string
    type: skillType
    description: string
    version: string
    ram_usage: string
    gpu_usage: string
    time: string
    display_name: string
  }
}

export const SkillsAllPage = () => {
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

  if (isSkillsLoading) return <>'Loading...'</>
  if (skillsError) return <> 'An error has occurred: '</>
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <Wrapper title='Public Skills' amount={skillsData.length}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
              {skillsData?.map((skill: skill_list) => {
                const date = dateToUTC(skill.metadata.date_created)
                return (
                  <SkillCard
                    skillName={skill.metadata.display_name}
                    companyName={skill.metadata.author}
                    skillType={skill.metadata.type}
                    date={date}
                    description={skill.metadata.description}
                    version={skill.metadata.version}
                    ram={skill.metadata.ram_usage}
                    gpu={skill.metadata.gpu_usage}
                    time={skill.metadata.execution_time}
                    executionTime={skill.metadata.execution_time}
                  />
                )
              })}
            </Container>
          </Wrapper>
        ) : (
          <Wrapper title='Public Skills' amount={skillsData.length}>
            <Table second='Type'>
              {skillsData?.map((skill: skill_list) => {
                const date = dateToUTC(skill.metadata.date_created)
                const time = timeToUTC(skill.metadata.date_created)
                return (
                  <SkillListItem
                    skillName={skill.metadata.display_name}
                    companyName={skill.metadata.author}
                    date={date}
                    time={time}
                    description={skill.metadata.description}
                    version={skill.metadata.version}
                    ram={skill.metadata.ram_usage}
                    gpu={skill.metadata.gpu_usage}
                    executionTime={skill.metadata.execution_time}
                    skillType={skill.metadata.type}
                    botName={''}
                  />
                )
              })}
            </Table>
          </Wrapper>
        )}
      </Main>
    </>
  )
}
