import { useState } from 'react'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
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
import { SkillModal } from '../components/SkillModal/SkillModal'
import { useAuth } from '../context/AuthProvider'
import { SkillType } from '../types/types'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'

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
  const [listView, setListView] = useState<boolean>(false)
  const viewHandler = () => {
    setListView(listView => !listView)
  }
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery('skills_list', getSkillList)

  skillsError && <> {'An error has occurred: '} + skillsError</>
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <Wrapper title='Public Skills' amount={skillsData?.length}>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
              {isSkillsLoading && <>{'Loading...'}</>}
              {skillsData?.map((skill: skill_list, i: number) => {
                const dateCreated = dateToUTC(skill.metadata.date_created)

                return (
                  <SkillCard
                    key={i}
                    type='public'
                    name={skill.metadata.display_name}
                    botName={skill.assistant_dist}
                    author='Deep Pavlov'
                    authorImg={DeepPavlovLogo}
                    skillType={skill.metadata.type}
                    dateCreated={dateCreated}
                    desc={skill.metadata.description}
                    version={skill.metadata.version}
                    ram={skill.metadata.ram_usage}
                    gpu={skill.metadata.gpu_usage}
                    time={skill.metadata.execution_time}
                    executionTime={`${skill.metadata.execution_time} sec`}
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
          <Wrapper title='Public Skills' amount={skillsData.length} fullHeight>
            {isSkillsLoading && <>{'Loading...'}</>}
            <Table second='Type'>
              {skillsData?.map((skill: skill_list, i: number) => {
                const dateCreated = dateToUTC(skill.metadata.date_created)
                const time = timeToUTC(skill.metadata.date_created)

                return (
                  <SkillListItem
                    key={i}
                    name={skill.metadata.display_name}
                    botName={skill.assistant_dist}
                    author='Deep Pavlov'
                    authorImg={DeepPavlovLogo}
                    dateCreated={dateCreated}
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
              })}
            </Table>
          </Wrapper>
        )}
        <BaseSidePanel position={{ top: 64 }} />
        <SkillModal />
      </Main>
    </>
  )
}
