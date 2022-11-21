import { useState } from 'react'
import { AddBotCard } from '../components/AddBotCard/AddBotCard'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { Container } from '../components/Container/Container'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../components/Wrapper/Wrapper'
import { Table } from '../components/Table/Table'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'

export const SkillsPage = () => {
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    console.log(listView)
  }
  const [skillCards, setSkillCards] = useState([])
  const addCard = () => {
    setSkillCards(skillCards.concat(<SkillInBotCard />))
  }
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <Wrapper
            alignItems='start'
            title='Public Skills'
            amount='5'
            linkTo='/allskills'>
            <Container flexDirection='row'>
              <SkillCard />
              <SkillCard />
              <SkillCard />
              <SkillCard />
            </Container>
          </Wrapper>
        ) : (
          <Wrapper title='Public Skills' amount='5' linkTo='/allskills'>
            <Table>
              <SkillListItem />
              <SkillListItem />
              <SkillListItem />
              <SkillListItem />
            </Table>
          </Wrapper>
        )}
        <Wrapper alignItems='start' title='Your Skills'>
          <Container flexDirection='row'>
            <AddBotCard addCard={addCard} />
            {skillCards}
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
