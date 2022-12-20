import { useState } from 'react'
import { Container } from '../ui/Container/Container'
import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../ui/Table/Table'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'

export const SkillsAllPage = () => {
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    console.log(listView)
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <Wrapper title='Public Skills' showAll={false} amount='5'>
            <Container
              display='grid'
              gridTemplateColumns='repeat(auto-fit, minmax(275px, 1fr))'>
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
            </Container>
          </Wrapper>
        ) : (
          <Wrapper title='Public Skills' amount='5' showAll={false}>
              <Table
                // checkbox={true}
              >
              <SkillListItem />
              <SkillListItem />
              <SkillListItem />
              <SkillListItem />
              <SkillListItem />
              <SkillListItem />
            </Table>
          </Wrapper>
        )}
      </Main>
    </>
  )
}
