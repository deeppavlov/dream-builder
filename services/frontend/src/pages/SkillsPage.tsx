import { useState } from 'react'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Table } from '../ui/Table/Table'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'

export const SkillsPage = () => {
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    setSkills([])
    console.log(listView)
  }
  const [skills, setSkills] = useState([])
  const addBot = () => {
    !listView
      ? setSkills(skills.concat(<SkillInBotCard />))
      : setSkills(skills.concat(<SkillListItem />))
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <>
            <Wrapper
              title='Public Skills'
              showAll={true}
              amount='5'
              linkTo='/allskills'
              paddingBottom='12px'>
              <Container paddingBottom='22px'>
                <SkillCard />
                <SkillCard />
                <SkillCard />
                <SkillCard />
                <SkillCard />
                <SkillCard />
                <SkillCard />
              </Container>
            </Wrapper>
            <Wrapper showAll={true} paddingBottom='12px' title='Your Skills'>
              <Container>
                <Container
                  position='sticky'
                  left='0'
                  top='0'
                  width='275px'
                  minWidth='275px'
                  paddingBottom='22px'>
                  <AddButton
                    height='330px'
                    listView={listView}
                    addBot={addBot}
                  />
                </Container>
                <Container>{skills}</Container>
              </Container>
            </Wrapper>
          </>
        ) : (
          <>
            <Wrapper
              title='Public Skills'
              showAll={true}
              amount='5'
              linkTo='/allskills'>
              <Table
                checkbox={true}
                second='Type'
                third='About'
                fifth='Date'
                sixth='Action'>
                <SkillListItem />
                <SkillListItem />
                <SkillListItem />
                <SkillListItem />
              </Table>
            </Wrapper>
            <Wrapper title='Your Virtual Assistants & Chatbots'>
                <Table
                  // checkbox={true}
                >
                <AddButton addBot={addBot} listView={listView} />
                {skills}
              </Table>
            </Wrapper>
          </>
        )}
      </Main>
    </>
  )
}
