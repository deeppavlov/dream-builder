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
import { useAuth } from '../Context/AuthProvider'
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

export const UsersSkillsPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState<boolean>(false)
  const viewHandler = () => {
    setListView(listView => !listView)
  }

  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <Wrapper title='Your Skills' amount={42}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'></Container>
          </Wrapper>
        ) : (
          <Wrapper title='Your Skills' amount={42}>
            <Table second='Type'>
              {/* {skillsData?.map((skill: skill_list, i: number) => {
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
                    executionTime={`${skill.metadata.execution_time} sec`}
                    skillType={skill.metadata.type}
                    disabledMsg={
                      auth?.user
                        ? undefined
                        : 'You must be signed in to add the skill'
                    }
                  />
                )
              })} */}
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
