import { api } from 'api/axiosConfig'

export interface IPatchComponentParams {
  component_id: number
  display_name: string
  description: string
  prompt: string
  lm_service_id: number
}

export async function patchComponent({
  component_id,
  display_name,
  description,
  prompt,
  lm_service_id,
}: IPatchComponentParams) {
  try {
    const { data } = await api.patch(`components/${component_id}`, {
      ...{ display_name, description, prompt, lm_service_id },
    })
    return data
  } catch (e) {
    throw e
  }
}
