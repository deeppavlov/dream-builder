import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Container } from '../ui/Container/Container'
import { useForm } from 'react-hook-form'
import { trigger } from '../utils/events'
import { Modal } from '../components/Modal/Modal'
import { getUsersAssistantDists } from '../services/getUsersAssistantDists'

export const DraftPage = () => {
  const styles = {
    padding: '12px',
    backgroundColor: 'lightcoral',
    borderRadius: '10px',
  }
  const formStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  }
  const inputStyles = {
    borderRadius: '12px',
    padding: '8px',
  }

  const queryClient = useQueryClient()
  async function getSMTH() {
    const { data: some_data } = await axios.get('http://localhost:3004/smth')
    return some_data
  }
  const { data: smth } = useQuery(['smth'], getSMTH)
  const deleteSMTH = useMutation({
    mutationFn: id => {
      return axios.delete(`http://localhost:3004/smth/${id}`)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: 'smth',
      }),
  })
  const submitHandler = data => {
    resetField('id')
    deleteSMTH.mutate(data?.id)
  }
  const { handleSubmit, register, resetField } = useForm({ mode: 'all' })

  const { data: uData } = useQuery('u', getUsersAssistantDists)
  console.log(`data = `, uData)
  const clickHandler = () => {}
  return (
    <>
      <Topbar />
      <Main>
        <Wrapper>
          <button style={styles} onClick={clickHandler}>
            GET DISTS
          </button>
        </Wrapper>
        <Wrapper>
          <button
            onClick={() => {
              trigger('Modal', {})
            }}
            style={styles}>
            Trigger Modal
          </button>
        </Wrapper>
        <Wrapper>
          <Container>
            <form style={formStyles} onSubmit={handleSubmit(submitHandler)}>
              <input style={inputStyles} {...register('id')} type='text' />
              <button style={styles} type='submit'>
                submit
              </button>
            </form>
          </Container>
        </Wrapper>
        <Wrapper>
          <Container>
            {smth?.map((item, id: number) => {
              return (
                <div
                  style={{ ...styles, backgroundColor: 'lightgreen' }}
                  key={id}>
                  {item.some_data}
                </div>
              )
            })}
          </Container>
        </Wrapper>
      </Main>
      <Modal />
    </>
  )
}
