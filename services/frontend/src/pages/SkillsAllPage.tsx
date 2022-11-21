import { useState } from 'react'
import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { Table } from '../components/Table/Table'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'

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
      <Sidebar />
      <Main>
        {!listView ? (
          <Wrapper alignItems='start'>
            <Container flexWrap='wrap' flexDirection='row'>
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
          <Wrapper>
            <Table>
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
