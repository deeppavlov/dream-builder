import { useState } from 'react'
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query'
import { dateToUTC } from '../utils/dateToUTC'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { BotCard } from '../components/BotCard/BotCard'
import { Slider } from '../ui/Slider/Slider'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { getUsersAssistantDists } from '../services/getUsersAssistantDists'
import { dist_list } from '../types/types'
import { useAuth } from '../Context/AuthProvider'
import DeepPavlovLogo from '@assets/icons/pavlovInCard.svg'
import { putAssistantDist } from '../services/putAssistanDist'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/Input/Input'
import Button from '../ui/Button/Button'
import axios from 'axios'

export const DraftPage = () => {
  const queryClient = useQueryClient()
  const auth = useAuth()
  const { data: distData } = useQuery(
    'usersAssistantDists',
    getUsersAssistantDists
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'all' })

  const onSubmit = data => {
    console.log(data)
    putAssistantDist(data).then(() => {
      queryClient.invalidateQueries({ queryKey: 'usersAssistantDists' })
    })
  }

  return (
    <>
      <Topbar />
      <Main>
        <Wrapper>
          {/*  "handleSubmit" will validate your inputs before invoking "onSubmit"
           */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Container flexDirection='column' gap='10px' padding='10px'>
              {/* register your input into the hook by invoking the "register" function */}

              <Input label='Dist Name' props={{ ...register('dist_name') }} />

              {/* include validation with required or other standard HTML validation rules */}
              <Input
                label='Description'
                props={{
                  ...register('dist_description', {
                    required: 'This field is required',
                  }),
                }}
                error={errors['dist_description']}
              />

              {/* errors will return when field validation fails  */}
              {errors.exampleRequired && <span>This field is required</span>}

              <Button props={{ type: 'submit' }} theme={'primary'} small long>
                Submit
              </Button>
            </Container>
          </form>
        </Wrapper>
        <Wrapper>
          <Container>
            <Slider>
              {distData?.map((dist: dist_list, i: number) => {
                const {
                  display_name,
                  name,
                  author,
                  description,
                  version,
                  ram_usage,
                  gpu_usage,
                  disk_usage,
                  date_created,
                } = dist
                const dateCreated = dateToUTC(date_created)
                return (
                  <BotCard
                    routingName={name}
                    key={i}
                    type='your'
                    name={display_name}
                    author={author}
                    authorImg={DeepPavlovLogo}
                    dateCreated={dateCreated}
                    desc={description}
                    version={version}
                    ram={ram_usage}
                    gpu={gpu_usage}
                    space={disk_usage}
                    disabledMsg={
                      auth?.user
                        ? undefined
                        : 'You must be signed in to clone the bot'
                    }
                  />
                )
              })}
            </Slider>
          </Container>
        </Wrapper>
      </Main>
    </>
  )
}
